using Domain.Common;

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


}