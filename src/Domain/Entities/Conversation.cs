using Domain.Common;
using Domain.Enums;
using Domain.Shared;

namespace Domain.Entities;

public class Conversation : AggregateRoot
{
    public bool IsOneToOne { get; private set; }
    public string? ImageUrl { get; private set; }
    public string? Name { get; private set; }
    public string? Theme { get; private set; }
    public Guid OwnerId { get; private set; }

    private readonly List<ConversationMember> _members = new();
    public IReadOnlyCollection<ConversationMember> Members => _members;

    private readonly List<Message> _messages = new();
    public IReadOnlyCollection<Message> Messages => _messages;

    private Conversation(long id) : base(id) { }

    public Conversation(long id, bool isOneToOne, string? name)
        : base(id)
    {
        IsOneToOne = isOneToOne;
        Name = name;
    }

    public Conversation(long id, bool isOneToOne, string? name, Guid ownerId)
        : base(id)
    {
        IsOneToOne = isOneToOne;
        Name = name;
        OwnerId = ownerId;
    }
    public Result AddMember(Guid userId,ConversationRole role)
    {
        if (_members.Any(m => m.UserId == userId))
        {
            return Result.Failure(new Error(
                "Conversation.DuplicateMember",
                "User is already a member of this conversation."));
        }

        var member = new ConversationMember(0, this.Id, userId, role);
        _members.Add(member);

        return Result.Success();
    }
    public Result Rename(Guid requesterId, string newName)
    {
        if (IsOneToOne)
            return Result.Failure(new Error(
                "Conversation.CannotRename",
                "Cannot rename a one-to-one conversation."));

        if (string.IsNullOrWhiteSpace(newName))
            return Result.Failure(new Error(
                "Conversation.InvalidName",
                "Group name cannot be empty."));


        Name = newName.Trim();
        return Result.Success();
    }

    public Result RemoveMember(Guid requesterId, Guid userIdToRemove)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot remove members from a one-to-one conversation."));

        var requester = _members.FirstOrDefault(m => m.UserId == requesterId);
        if (requester == null || requester.Role != ConversationRole.Admin)
            return Result.Failure(new Error("Conversation.Forbidden", "Only admins can remove members."));

        var memberToRemove = _members.FirstOrDefault(m => m.UserId == userIdToRemove);
        if (memberToRemove == null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "The user is not a member of this conversation."));

        _members.Remove(memberToRemove);
        return Result.Success();
    }

    public Result Leave(Guid userId)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot leave a one-to-one conversation."));

        var member = _members.FirstOrDefault(m => m.UserId == userId);
        if (member is null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "You are not a member of this conversation."));

        var otherAdmins = _members.Count(m => m.Role == ConversationRole.Admin && m.UserId != userId);
        if (otherAdmins == 0 && member.Role == ConversationRole.Admin && _members.Count > 1)
            return Result.Failure(new Error("Conversation.LastAdmin", "Cannot leave: you are the last admin. Transfer ownership first."));

        _members.Remove(member);
        return Result.Success();
    }

    public Result AssignAdminRole(Guid requesterId, Guid targetUserId)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot assign admin in a one-to-one conversation."));

        if (OwnerId != requesterId)
            return Result.Failure(new Error("Conversation.Forbidden", "Only the owner can assign admin role."));

        var targetMember = _members.FirstOrDefault(m => m.UserId == targetUserId);
        if (targetMember is null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "The target user is not a member of this conversation."));

        if (targetMember.Role == ConversationRole.Owner)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot assign admin role to the owner."));

        if (targetMember.Role == ConversationRole.Admin)
            return Result.Failure(new Error("Conversation.AlreadyAdmin", "The user is already an admin."));

        targetMember.UpdateRole(ConversationRole.Admin);
        return Result.Success();
    }

    public Result RevokeAdminRole(Guid requesterId, Guid targetUserId)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot revoke admin in a one-to-one conversation."));

        if (OwnerId != requesterId)
            return Result.Failure(new Error("Conversation.Forbidden", "Only the owner can revoke admin role."));

        if (OwnerId == targetUserId)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot revoke admin role from the owner."));

        var targetMember = _members.FirstOrDefault(m => m.UserId == targetUserId);
        if (targetMember is null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "The target user is not a member of this conversation."));

        if (targetMember.Role != ConversationRole.Admin)
            return Result.Failure(new Error("Conversation.NotAdmin", "The user is not an admin."));

        targetMember.UpdateRole(ConversationRole.Member);
        return Result.Success();
    }

    public Result KickMemberOut(Guid requesterId, Guid targetUserId)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot kick members from a one-to-one conversation."));

        if (OwnerId == targetUserId)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot kick the owner from the conversation."));

        var requester = _members.FirstOrDefault(m => m.UserId == requesterId);
        if (requester is null)
            return Result.Failure(new Error("Conversation.Forbidden", "You are not a member of this conversation."));

        if (requester.Role != ConversationRole.Admin && requester.Role != ConversationRole.Owner)
            return Result.Failure(new Error("Conversation.Forbidden", "Only admins or the owner can kick members."));

        var targetMember = _members.FirstOrDefault(m => m.UserId == targetUserId);
        if (targetMember is null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "The target user is not a member of this conversation."));

        _members.Remove(targetMember);
        return Result.Success();
    }
}