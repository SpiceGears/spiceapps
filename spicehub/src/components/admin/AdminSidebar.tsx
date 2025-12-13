type Props = {
    activeTab: "members" | "roles" | "approvals"
    setActiveTab: (tab: "members" | "roles" | "approvals") => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
    return (
              <div className="w-64 h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-4 py-6">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("members")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "members"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              Członkowie
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "roles"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              Role
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "approvals"
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Zatwierdzenia
            </button>
          </nav>
        </div>
      </div>
    )
}