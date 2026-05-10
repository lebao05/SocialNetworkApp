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
}