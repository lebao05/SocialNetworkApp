using Domain.Common;
using Domain.Enums;
using Domain.Shared;

namespace Domain.Entities;

public class Conversation : AggregateRoot
{
    public bool IsOneToOne { get; private set; }
    public string? Name { get; private set; }
    public string? Theme { get; private set; }
    public bool IsDeleted { get; private set; }

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

}