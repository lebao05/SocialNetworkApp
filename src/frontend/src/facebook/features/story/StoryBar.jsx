import { mockStories, mockContacts, currentUser } from "../../../shared/data/mockData";

function StoryCard({ story, contact }) {
  return (
    <div className="relative w-28 h-48 rounded-xl overflow-hidden cursor-pointer shrink-0 hover:opacity-90 transition-opacity">
      <img src={story.thumbnail} alt="story" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-4 border-blue-500 overflow-hidden">
        <img src={contact?.avatar} alt={contact?.name} className="w-full h-full object-cover" />
      </div>
      <p className="absolute bottom-2 left-2 text-white text-xs font-semibold">{contact?.name.split(" ").pop()}</p>
    </div>
  );
}

function StoryBar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {/* Create Story Card */}
      <div className="relative w-28 h-48 rounded-xl overflow-hidden cursor-pointer shrink-0 bg-white shadow hover:shadow-md transition-shadow border border-gray-100">
        <div className="h-32 overflow-hidden">
          <img src={currentUser.avatar} alt="me" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-[88px] left-1/2 -translate-x-1/2 w-9 h-9 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-xl leading-none">
          +
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <p className="text-xs font-semibold text-gray-800">Tạo tin</p>
        </div>
      </div>

      {mockStories.map((story) => {
        const contact = mockContacts.find((c) => c.id === story.userId);
        return <StoryCard key={story.id} story={story} contact={contact} />;
      })}
    </div>
  );
}

export default StoryBar;
