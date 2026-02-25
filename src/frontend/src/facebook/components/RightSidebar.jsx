import ContactList from "../features/contacts/ContactList";

function RightSidebar() {
  return (
    <aside className="w-72 fixed top-14 right-0 h-[calc(100vh-56px)] overflow-y-auto p-4 hidden lg:block">
      <div className="mb-6">
        <h3 className="text-gray-500 font-semibold text-sm mb-3">Được tài trợ</h3>
        <div className="flex gap-3">
          <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Nâng cao kỹ năng React của bạn</p>
            <p className="text-xs text-gray-500 mt-1">udemy.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <ContactList />
      </div>
    </aside>
  );
}

export default RightSidebar;
