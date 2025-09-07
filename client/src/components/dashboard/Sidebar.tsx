import { 
  Home, 
  ChevronUp, 
  ChevronDown, 
  UserPlus, 
  Users, 
  BookOpen, 
  Plus, 
  Layers,
  GraduationCap,
  Settings,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  Sparkles
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "../ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "../ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { useAuth } from "../../contexts/AuthContext"

  // Main navigation items
  const mainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,

    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: GraduationCap,
    },
  ]

  // Teachers submenu items
  const teachersSubItems = [
    {
      title: "Add Teacher",
      url: "/dashboard/teachers/add",
      icon: UserPlus,
    },
    {
      title: "All Teachers",
      url: "/dashboard/teachers/list",
      icon: Users,
    },
  ]

  // Courses submenu items
  const coursesSubItems = [
    {
      title: "Create Course",
      url: "/dashboard/courses/add",
      icon: Plus,
    },
    {
      title: "All Courses",
      url: "/dashboard/courses/list",
      icon: BookOpen,
    },
    {
      title: "Course Content",
      url: "/dashboard/courses/meta",
      icon: Layers,
    },
  ]

  // Settings and support items
  const settingsItems = [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ]

  export function AppSidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
  
    const handleLogout = () => {
      logout();
    };

    const isActive = (url: string) => {
      return location.pathname === url || location.pathname.startsWith(url + '/');
    };

    return (
      <Sidebar className="border-r border-gray-100/50 bg-white/80 backdrop-blur-xl">
        {/* Apple-inspired Header */}
        <SidebarHeader className="border-b border-gray-100/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900">Graidea</h1>
              <p className="text-xs text-gray-500">Learning Platform</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider ">
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`group pt-2 relative rounded-xl transition-all duration-200 hover:bg-gray-50/80 ${
                        isActive(item.url) 
                          ? 'bg-blue-50/80 text-blue-700 shadow-sm px-5 py-4' 
                          : 'text-gray-700 hover:text-gray-900 px-3 py-3'
                      }`}
                    >
                      <Link to={item.url} className=" flex items-center gap-3">
                        <item.icon className={`h-5 w-5 transition-colors ${
                          isActive(item.url) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs text-gray-500">{item.description}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Teachers Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider ">
              Teachers
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="group relative rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-gray-50/80 text-gray-700 hover:text-gray-900">
                        <Users className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                        <span className="font-medium">Manage Teachers</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 " />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="">
                      <SidebarMenuSub className="ml-4 mt-1 space-y-1">
                        {teachersSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              className={`rounded-lg transition-all duration-200 hover:bg-gray-50/60 ${
                                isActive(subItem.url) 
                                  ? 'bg-blue-50/60 text-blue-700 px-5 py-3' 
                                  : 'text-gray-600 hover:text-gray-900 px-3 py-2.5'
                              }`}
                            >
                              <Link to={subItem.url} className="flex items-center gap-3">
                                <subItem.icon className="h-4 w-4" />
                                <span className="text-sm">{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Courses Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider ">
              Courses
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="group relative rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-gray-50/80 text-gray-700 hover:text-gray-900">
                        <BookOpen className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                        <span className="font-medium">Course Management</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 " />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="">
                      <SidebarMenuSub className="ml-4 mt-1 space-y-1">
                        {coursesSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              className={`rounded-lg transition-all duration-200 hover:bg-gray-50/60 ${
                                isActive(subItem.url) 
                                  ? 'bg-blue-50/60 text-blue-700 px-5 py-3' 
                                  : 'text-gray-600 hover:text-gray-900 px-3 py-2.5'
                              }`}
                            >
                              <Link to={subItem.url} className="flex items-center gap-3">
                                <subItem.icon className="h-4 w-4" />
                                <span className="text-sm">{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Settings Section */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`group relative rounded-xl transition-all duration-200 hover:bg-gray-50/80 ${
                        isActive(item.url) 
                          ? 'bg-blue-50/80 text-blue-700 px-5 py-4' 
                          : 'text-gray-600 hover:text-gray-900 px-3 py-3'
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Apple-inspired Footer */}
        <SidebarFooter className="border-t border-gray-100/50 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="group relative rounded-xl px-3 py-3 transition-all duration-200 hover:bg-gray-50/80 text-gray-700 hover:text-gray-900">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col items-start ">
                      <span className="font-medium">{user?.name || 'User'}</span>
                      <span className="text-xs text-gray-500">Administrator</span>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4 " />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-56 rounded-xl border border-gray-100/50 bg-white/95 backdrop-blur-xl p-2 shadow-xl"
                  align="end"
                >
                  <DropdownMenuItem className="rounded-lg px-3 py-2.5 hover:bg-gray-50/80">
                    <User className="mr-3 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg px-3 py-2.5 hover:bg-gray-50/80">
                    <CreditCard className="mr-3 h-4 w-4" />
                    <span>Billing & Plans</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem 
                    className="rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50/80"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }