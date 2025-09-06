import { AppSidebar } from "./Sidebar"
import Header from "./Header"
import { SidebarProvider } from "../ui/sidebar"
import { SidebarInset } from "../ui/sidebar"

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
