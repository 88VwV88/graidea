import AdminNavbar from "./AdminNavbar"

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default Layout
