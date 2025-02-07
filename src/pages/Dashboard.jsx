/* eslint-disable react/prop-types */
import { Star, Search, Plus, ChevronUp, Trash2, Edit, Check, ArrowUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import supabase from "../utils/supabaseClient"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const { user } = useAuth()
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState([])
  const [editingProject, setEditingProject] = useState(null)
  const [newTask, setNewTask] = useState({})

  const statusFilters = ['Em andamento', 'Revisão', 'Aprovado', 'Arquivado']
  const taskCategories = ['Trabalho', 'Pessoal']

  useEffect(() => {
    const loadProjects = async () => {
      const localProjects = JSON.parse(localStorage.getItem('projects')) || []
      if (localProjects.length > 0) {
        setProjects(localProjects)
      } else {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
        if (data) setProjects(data)
      }
    }
    loadProjects()
  }, [user])

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  const syncWithSupabase = async () => {
    await supabase
      .from('projects')
      .upsert(projects.map(p => ({ ...p, user_id: user.id })))
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(projects)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setProjects(items)
  }

  const StatusSelector = ({ project }) => (
    <select
      value={project.status}
      onChange={(e) => updateProject({ ...project, status: e.target.value })}
      className={`px-2 py-1 rounded-full text-xs ${
        project.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' :
        project.status === 'Revisão' ? 'bg-amber-100 text-amber-700' :
        project.status === 'Arquivado' ? 'bg-gray-100 text-gray-700' :
        'bg-blue-100 text-blue-700'
      }`}
    >
      {statusFilters.map(option => (
        <option key={option} value={option} className="bg-white">
          {option}
        </option>
      ))}
    </select>
  )

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: 'Novo Projeto',
      status: 'Em andamento',
      dueDate: new Date().toISOString().split('T')[0],
      collaborators: 0,
      tasks: []
    }
    setProjects([...projects, newProject])
  }

  const updateProject = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
  }

  const deleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId))
  }

  const addTask = (projectId) => {
    if (!newTask[projectId]?.text) return
    
    const task = {
      id: Date.now(),
      text: newTask[projectId].text,
      completed: false,
      category: newTask[projectId].category || 'Trabalho'
    }
    
    setProjects(projects.map(p => p.id === projectId ? {
      ...p,
      tasks: [...p.tasks, task]
    } : p))
    
    setNewTask({ ...newTask, [projectId]: { text: '', category: '' } })
  }

  const toggleTask = (projectId, taskId) => {
    setProjects(projects.map(p => p.id === projectId ? {
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    } : p))
  }

  const filteredProjects = projects.filter(p => 
    (activeFilter !== null ? p.status === statusFilters[activeFilter] : true) &&
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      {/* Sidebar */}
      <div className="w-20 bg-my-bg bg-cover rounded-full flex flex-col items-center py-8 space-y-6 shadow-lg mr-4">
        <div className="w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm" />
        <div className="flex flex-col space-y-6">
          {statusFilters.map((status, i) => (
            <div key={i} className="relative group flex flex-col items-center">
              <Star
                onClick={() => setActiveFilter(activeFilter === i ? null : i)}
                className={`w-5 h-5 transition-all duration-300 cursor-pointer ${
                  activeFilter === i 
                    ? "text-white fill-white scale-110" 
                    : "text-white/80 hover:text-white hover:scale-105"
                }`}
              />
              <span className="absolute left-14 bg-white text-xs text-gray-600 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex flex-col">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-gray-600 text-lg font-medium">{user?.user_metadata?.name}</h1>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Pesquisar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={addProject}
                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={syncWithSupabase}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                title="Sincronizar dados"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </header>

          <Droppable droppableId="projects" direction="horizontal" isDropDisabled={false}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredProjects.map((project, index) => (
                  <Draggable key={project.id} draggableId={String(project.id)} index={index} isDragDisabled={false}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div {...provided.dragHandleProps}>
                            <ArrowUpDown className="w-4 h-4 text-gray-400 cursor-move hover:text-emerald-500" />
                          </div>
                          <StatusSelector project={project} />
                        </div>

                        <div className="space-y-4">
                          {editingProject === project.id ? (
                            <input
                              value={project.title}
                              onChange={(e) => updateProject({ ...project, title: e.target.value })}
                              className="w-full font-medium mb-2 border-b border-gray-200 focus:outline-none"
                            />
                          ) : (
                            <h3 className="font-medium mb-2">{project.title}</h3>
                          )}

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>🗓 {project.dueDate}</span>
                            <span>👥 {project.collaborators}</span>
                          </div>

                          <div className="space-y-2">
                            {project.tasks.map(task => (
                              <div key={task.id} className="flex items-center gap-2 group">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(project.id, task.id)}
                                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                                />
                                <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                  {task.text}
                                </span>
                                <select
                                  value={task.category}
                                  onChange={(e) => {
                                    const updatedTasks = project.tasks.map(t => 
                                      t.id === task.id ? { ...t, category: e.target.value } : t
                                    )
                                    updateProject({ ...project, tasks: updatedTasks })
                                  }}
                                  className="text-xs px-2 py-1 rounded border border-gray-200 focus:ring-emerald-500"
                                >
                                  {taskCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 mt-4">
                            <input
                              value={newTask[project.id]?.text || ''}
                              onChange={(e) => setNewTask({
                                ...newTask,
                                [project.id]: { ...newTask[project.id], text: e.target.value }
                              })}
                              placeholder="Nova tarefa"
                              className="flex-1 px-2 py-1 text-sm border rounded focus:ring-emerald-500"
                            />
                            <select
                              value={newTask[project.id]?.category || 'Trabalho'}
                              onChange={(e) => setNewTask({
                                ...newTask,
                                [project.id]: { ...newTask[project.id], category: e.target.value }
                              })}
                              className="text-xs px-2 py-1 rounded border border-gray-200 focus:ring-emerald-500"
                            >
                              {taskCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => addTask(project.id)}
                              className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                            {editingProject === project.id ? (
                              <button
                                onClick={() => setEditingProject(null)}
                                className="p-1 text-emerald-500 hover:bg-gray-100 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingProject(project.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="p-1 text-red-500 hover:bg-gray-100 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  )
}

export default Dashboard