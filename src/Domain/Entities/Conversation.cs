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
    public string? DefaultReaction { get; private set; }
    public Guid OwnerId { get; private set; }

    private readonly List<ConversationMember> _members = new();
    public IReadOnlyCollection<ConversationMember> Members => _members;

    private readonly List<Message> _messages = new();
    public IReadOnlyCollection<Message> Messages => _messages;

    private Conversation(long id) : base(id) { }

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
        if (member == null)
            return Result.Failure(new Error("Conversation.NotMember", "You are not a member of this conversation."));
        _members.Remove(member);
        return Result.Success();
    }

    public Result AssignAdminRole(Guid requesterId, Guid targetUserId)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot assign admin in a one-to-one conversation."));

        if (OwnerId != requesterId)
            return Result.Failure(new Error("Conversation.Forbidden", "Only the owner can assign admin role."));

        if (OwnerId == targetUserId)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot assign admin role to the owner."));

        var target = _members.FirstOrDefault(m => m.UserId == targetUserId);
        if (target == null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "The user is not a member of this conversation."));

        if (target.Role == ConversationRole.Admin)
            return Result.Failure(new Error("Conversation.AlreadyAdmin", "The user is already an admin."));

        target.UpdateRole(ConversationRole.Admin);
        return Result.Success();
    }

    public Result RevokeAdminRole(Guid requesterId, Guid targetUserId)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot revoke admin in a one-to-one conversation."));

        if (OwnerId != requesterId)
            return Result.Failure(new Error("Conversation.Forbidden", "Only the owner can revoke admin role."));

        if (OwnerId == targetUserId)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot revoke admin role of the owner."));

        var target = _members.FirstOrDefault(m => m.UserId == targetUserId);
        if (target == null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "The user is not a member of this conversation."));

        if (target.Role != ConversationRole.Admin)
            return Result.Failure(new Error("Conversation.NotAdmin", "The user is not an admin."));

        target.UpdateRole(ConversationRole.Member);
        return Result.Success();
    }

    public Result KickMemberOut(Guid requesterId, Guid targetUserId)
    {
        if (IsOneToOne)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot kick from a one-to-one conversation."));

        if (OwnerId == targetUserId)
            return Result.Failure(new Error("Conversation.InvalidOperation", "Cannot kick the owner of the conversation."));

        var requester = _members.FirstOrDefault(m => m.UserId == requesterId);
        if (requester == null || (requester.Role != ConversationRole.Admin && requester.Role != ConversationRole.Owner))
            return Result.Failure(new Error("Conversation.Forbidden", "Only admins or the owner can kick members."));

        var target = _members.FirstOrDefault(m => m.UserId == targetUserId);
        if (target == null)
            return Result.Failure(new Error("Conversation.MemberNotFound", "The user is not a member of this conversation."));

        _members.Remove(target);
        return Result.Success();
    }

    public Result UpdateConversation(Guid requesterId, string? name, string? theme, string? defaultReaction)
    {
        var member = _members.FirstOrDefault(m => m.UserId == requesterId);
        if (member == null)
            return Result.Failure(new Error("Conversation.NotMember", "You are not a member of this conversation."));

        if (member.Role != ConversationRole.Admin && member.Role != ConversationRole.Owner)
            return Result.Failure(new Error("Conversation.Forbidden", "Only admins or the owner can update conversation settings."));

        if (!IsOneToOne && !string.IsNullOrWhiteSpace(name) && Name != name.Trim())
            Name = name.Trim();

        var trimmedTheme = string.IsNullOrWhiteSpace(theme) ? null : theme.Trim();
        if (Theme != trimmedTheme)
            Theme = trimmedTheme;

        var trimmedReaction = string.IsNullOrWhiteSpace(defaultReaction) ? null : defaultReaction.Trim();
        if (DefaultReaction != trimmedReaction)
            DefaultReaction = trimmedReaction;

        return Result.Success();
    }

    public void SetImageUrl(string url)
    {
        ImageUrl = url;
    }
}