import * as React from "react"

// import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,  CameraIcon, FileTextIcon,
  // ListIcon, ChartBarIcon, FolderIcon, UsersIcon,
  // Settings2Icon, CircleHelpIcon, SearchIcon,
  // DatabaseIcon, FileChartColumnIcon, FileIcon,
} from "lucide-react"

import logo from "@/assets/logo.svg"



const data = {
  user: {
    name: "张",
    email: "TEL:15986369969",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "酒店营业概览",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "酒店营业总额报表",
      url: "/yy-report",
      icon: (
        <FileTextIcon
        />
      ),
    },
    // {
    //   title: "Lifecycle",
    //   url: "#",
    //   icon: (
    //     <ListIcon
    //     />
    //   ),
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: (
    //     <ChartBarIcon
    //     />
    //   ),
    // },
    // {
    //   title: "Projects",
    //   url: "#",
    //   icon: (
    //     <FolderIcon
    //     />
    //   ),
    // },
    // {
    //   title: "Team",
    //   url: "#",
    //   icon: (
    //     <UsersIcon
    //     />
    //   ),
    // },
  ],
  navReports: [
    { title: "收银入账明细报表", icon: <FileTextIcon /> },
    { title: "收银汇总报表", icon: <FileTextIcon /> },
    { title: "收银员收款报表", icon: <FileTextIcon /> },
    { title: "收入综合日报表", icon: <FileTextIcon /> },
    { title: "管理层日报表", icon: <FileTextIcon /> },
    { title: "管理层时段分析报表", icon: <FileTextIcon /> },
    { title: "哑房账明细报表", icon: <FileTextIcon /> },
    { title: "经理日报表", icon: <FileTextIcon /> },
    { title: "销售分析月度综合统计报表", icon: <FileTextIcon /> },
    { title: "续住客人报表", icon: <FileTextIcon /> },
    { title: "客房退房一览表", icon: <FileTextIcon /> },
    { title: "历史房价报表", icon: <FileTextIcon /> },
    { title: "宾客账日明细报表", icon: <FileTextIcon /> },
    { title: "宾客账月累计报表", icon: <FileTextIcon /> },
    { title: "收银员收款报表", icon: <FileTextIcon /> },
    { title: "销售分析报表-客人来源", icon: <FileTextIcon /> },
    { title: "客房类别收益分析报表", icon: <FileTextIcon /> },
    { title: "客房出租率报表", icon: <FileTextIcon /> },
    { title: "客房类别收益时段分析报表", icon: <FileTextIcon /> },
    { title: "在住房当天早餐券发放报表", icon: <FileTextIcon /> },
    { title: "经营项目分析汇总综合统计报表", icon: <FileTextIcon /> },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <CameraIcon
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: (
  //       <Settings2Icon
  //       />
  //     ),
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: (
  //       <CircleHelpIcon
  //       />
  //     ),
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: (
  //       <SearchIcon
  //       />
  //     ),
  //   },
  // ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: (
  //       <DatabaseIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: (
  //       <FileChartColumnIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: (
  //       <FileIcon
  //       />
  //     ),
  //   },
  // ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <img src={logo} alt="住客邦" className="size-5! rounded-sm" />
              <span className="text-base font-semibold">住客邦 - 酒店云数平台</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain items={data.navReports} label="报表中心" />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
