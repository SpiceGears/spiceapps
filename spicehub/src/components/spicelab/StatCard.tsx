export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div
      className="
      flex flex-col items-center justify-center p-4
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      rounded-lg shadow-sm hover:shadow
      transition
    "
    >
      <div className="text-2xl text-gray-500 dark:text-gray-400 mb-2">
        {icon}
      </div>
      <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {title}
      </div>
    </div>
  )
}