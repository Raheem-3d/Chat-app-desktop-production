

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { isSameDay, format, addMonths, subMonths } from "date-fns"
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus, CheckCircle, AlertCircle, Target, Users, BarChart3 } from "lucide-react"

type Task = {
  id: string
  title: string
  status: string
  priority: string
  deadline: string
  description?: string
}

export default function TaskCalendarPage() {
  const { data: session } = useSession()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksForDate, setTasksForDate] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTaskList, setShowTaskList] = useState(false)
  const [user, setUser] = useState<any>(null)

  const CheckUser = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        return
      }
      throw new Error("Failed to fetch user data")
    } catch (error) {
      console.error("Error fetching user:", error)
      // Set mock user for demo
      setUser({ role: "ADMIN" })
    }
  }

  // Check if user can create tasks (ORG_ADMIN or MANAGER only)
  const canCreateTasks = ["ORG_ADMIN", "MANAGER"].includes((session?.user as any)?.role || user?.role || "")

  // Fetch tasks with deadlines
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/tasks?withDeadlines=true")
        if (response.ok) {
          const data = await response.json()
          setTasks(data)
        } else {
          // Mock data for demo
          const mockTasks = [
            {
              id: "1",
              title: "Complete Project Report",
              status: "IN_PROGRESS",
              priority: "HIGH",
              deadline: new Date().toISOString(),
              description: "Finalize the quarterly project report with all metrics and analysis for stakeholder review"
            },
            {
              id: "2",
              title: "Team Meeting - Sprint Planning",
              status: "TODO",
              priority: "MEDIUM",
              deadline: new Date(Date.now() + 86400000).toISOString(),
              description: "Weekly standup meeting to discuss project progress and plan next sprint tasks"
            },
            {
              id: "3",
              title: "Code Review Session",
              status: "TODO",
              priority: "LOW",
              deadline: new Date(Date.now() + 172800000).toISOString(),
              description: "Review pull requests for the new feature implementation and provide feedback"
            },
            {
              id: "4",
              title: "Client Presentation",
              status: "TODO",
              priority: "URGENT",
              deadline: new Date(Date.now() + 259200000).toISOString(),
              description: "Present final project deliverables to client stakeholders"
            },
            {
              id: "5",
              title: "Database Optimization",
              status: "BLOCKED",
              priority: "HIGH",
              deadline: new Date(Date.now() + 345600000).toISOString(),
              description: "Optimize database queries to improve application performance"
            }
          ]
          setTasks(mockTasks)
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
    CheckUser().catch((e) => console.error(e))
  }, [])

  // Update tasks for selected date
  useEffect(() => {
    if (!date) return
    const filtered = tasks.filter(
      (task) => task.deadline && isSameDay(new Date(task.deadline), date)
    )
    setTasksForDate(filtered)
    setShowTaskList(true)
  }, [date, tasks])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
      case "URGENT":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      case "BLOCKED":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      case "DONE":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <AlertCircle className="h-3 w-3 text-orange-600" />
      case "URGENT":
        return <AlertCircle className="h-3 w-3 text-red-600" />
      case "MEDIUM":
        return <Target className="h-3 w-3 text-amber-600" />
      case "LOW":
        return <CheckCircle className="h-3 w-3 text-emerald-600" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "IN_PROGRESS":
        return <BarChart3 className="h-3 w-3 text-blue-600" />
      case "BLOCKED":
        return <AlertCircle className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const upcomingTasksCount = tasks.filter(
    (task) => task.deadline && new Date(task.deadline) >= new Date()
  ).length

  const completedTasksCount = tasks.filter(task => task.status === "DONE").length
  const inProgressTasksCount = tasks.filter(task => task.status === "IN_PROGRESS").length

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Custom Calendar Component
  const CustomCalendar = () => {
    const today = new Date()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return (
      <div className="w-full">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-bold text-gray-700 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 ">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
            const isToday = isSameDay(day, today)
            const isSelected = date && isSameDay(day, date)
            const dayTasks = tasks.filter(task => 
              task.deadline && isSameDay(new Date(task.deadline), day)
            )

            return (
              <div
                key={index}
                className={`
                  min-h-32 p-2 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg group 
                  ${isCurrentMonth ? 'bg-white border-gray-200 hover:border-gray-300' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}
                  ${isToday ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' : ''}
                  ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-300' : ''}
                  ${dayTasks.length > 0 ? 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50' : ''}
                `}
                onClick={() => setDate(day)}
              >
                {/* Date number */}
                <div className={`
                  text-sm font-bold mb-2 flex items-center justify-between
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday ? 'text-blue-700' : ''}
                  ${isSelected ? 'text-indigo-700' : ''}
                `}>
                  <span className="text-base">{day.getDate()}</span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-2 py-0.5 min-w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                
                {/* Task previews */}
                <div className="space-y-1.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div 
                      key={task.id} 
                      className={`
                        px-2 py-1.5 rounded-lg text-xs border transition-all duration-200 hover:shadow-md hover:scale-105 group-hover:border-opacity-80
                        ${getPriorityColor(task.priority)}
                      `}
                      title={`${task.title}: ${task.description || 'No description'}`}
                    >
                      <div className="flex items-start gap-1.5">
                        <div className="shrink-0 mt-0.5">
                          {getPriorityIcon(task.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate leading-tight text-xs mb-1">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-[10px] opacity-80 leading-tight line-clamp-2">
                              {task.description.substring(0, 50)}
                              {task.description.length > 50 && '...'}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className={`
                              inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border
                              ${getStatusColor(task.status)}
                            `}>
                              {getStatusIcon(task.status)}
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-600 px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg font-medium border border-gray-300">
                      +{dayTasks.length - 3} more tasks
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50  ">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Calendar Section */}
          <div className="w-full xl:w-2/3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Calendar className="h-8 w-8" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold mb-1">Task Calendar</h1>
                        <p className="text-blue-100 text-lg">Manage your tasks and deadlines efficiently</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={handleNextMonth}
                      className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={() => setCurrentMonth(new Date())}
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 text-sm font-semibold hover:scale-105"
                    >
                      Today
                    </button>
                    {canCreateTasks && (
                      <Link href="/dashboard/tasks/new">
                        <button className="px-6 py-3 bg-white text-blue-600 hover:bg-gray-50 rounded-xl transition-all duration-200 text-sm font-semibold flex items-center gap-2 hover:scale-105 shadow-lg">
                          <Plus className="h-5 w-5" />
                          New Task
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Month and Stats */}
              <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <p className="text-gray-600 text-lg">Click on any date to view and manage your tasks</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold">{upcomingTasksCount}</div>
                      <div className="text-sm opacity-90">Upcoming</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold">{inProgressTasksCount}</div>
                      <div className="text-sm opacity-90">In Progress</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold">{completedTasksCount}</div>
                      <div className="text-sm opacity-90">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="p-8">
                <CustomCalendar />
              </div>

              {/* Footer */}
              <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                      <span className="text-gray-700 font-medium">Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                      <span className="text-gray-700 font-medium">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                      <span className="text-gray-700 font-medium">Has Tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-gray-700 font-medium">High Priority</span>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-white rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-700 shadow-sm">
                    {tasks.length} Total Tasks
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          <div className="w-full xl:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-fit">
              <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {date ? format(date, "MMMM d, yyyy") : "Select a Date"}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {date ? `${tasksForDate.length} tasks scheduled` : "Choose a date to view tasks"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading tasks...</p>
                  </div>
                ) : date ? (
                  tasksForDate.length > 0 ? (
                    <div className="space-y-6">
                      {tasksForDate.map((task, index) => (
                        <Link key={task.id} href={`/dashboard/tasks/${task.id}`} className="block group">
                          <div className="p-6 border-2 border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-indigo-300 group-hover:scale-105">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <h4 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors flex-1 leading-tight">
                                {task.title}
                              </h4>
                              <div className="flex flex-col gap-2 shrink-0">
                                <span className={`
                                  px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 flex items-center gap-1
                                  ${getPriorityColor(task.priority)}
                                `}>
                                  {getPriorityIcon(task.priority)}
                                  {task.priority}
                                </span>
                                <span className={`
                                  px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 flex items-center gap-1
                                  ${getStatusColor(task.status)}
                                `}>
                                  {getStatusIcon(task.status)}
                                  {task.status.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            
                            {task.description && (
                              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {format(new Date(task.deadline), "h:mm a")}
                                </span>
                              </div>
                              <button className="text-indigo-600 hover:text-indigo-700 font-bold text-sm group-hover:translate-x-1 transition-transform duration-200">
                                View Details →
                              </button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="mb-6 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl w-fit mx-auto">
                        <Calendar className="h-12 w-12 text-gray-400" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">No tasks scheduled</h4>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        This date is free from any tasks.<br />
                        Perfect day to take a break or plan ahead!
                      </p>
                      {canCreateTasks && (
                        <Link href="/dashboard/tasks/new">
                          <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold text-lg flex items-center gap-3 mx-auto hover:scale-105 shadow-lg">
                            <Plus className="h-5 w-5" />
                            Schedule New Task
                          </button>
                        </Link>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center py-16">
                    <div className="mb-6 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl w-fit mx-auto">
                      <Calendar className="h-12 w-12 text-indigo-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Select a Date</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Click on any date in the calendar<br />
                      to view your scheduled tasks
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

 