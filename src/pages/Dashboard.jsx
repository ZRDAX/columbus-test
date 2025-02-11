/* eslint-disable react/prop-types */
import { Star, Search, Plus, Trash2, Edit, Check, ArrowUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import { 
  arrayMove, 
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  SortableContext,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import supabase from "../utils/supabaseClient"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button, Select} from "@heroui/react";

// eslint-disable-next-line no-unused-vars
const SortableProject = ({ project, index, children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes}
      {...props}
    >
      {children}
      <div {...listeners} className="absolute top-4 right-4 cursor-move">
        <ArrowUpDown className="w-4 h-4 text-gray-400 hover:text-emerald-500" />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth()
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState([])
  const [editingProject, setEditingProject] = useState(null)
  const [newTask, setNewTask] = useState({})
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const statusFilters = ['Em andamento', 'Revisão', 'Aprovado', 'Arquivado']
  const taskCategories = ['Trabalho', 'Pessoal', 'Estudo']

  useEffect(() => {
    if (user?.id) {
      const loadProjects = async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);
        if (!error && data) {
          setProjects(data);
        }
      };
      loadProjects();
    }
  }, [user?.id])   // Dependência apenas em `user`


  const syncWithSupabase = async (projectsToSync) => {
    try {
      const { error } = await supabase
        .from('projects')
        .upsert(
          projectsToSync.map(p => ({
            id: p.id,
            title: p.title,
            status: p.status,
            due_date: p.due_date,
            tasks: p.tasks,
            user_id: user.id
          })),
          { onConflict: 'id' }
        );
  
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao sincronizar:", err);
    }
  };


  useEffect(() => {
    if (user && projects.length > 0) {
      syncWithSupabase(projects); // Passar `projects` para evitar chamadas desnecessárias
    }
  }, [ user, projects]); // Agora depende apenas de `projects`

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setProjects((projects) => {
        const oldIndex = projects.findIndex((project) => project.id === active.id);
        const newIndex = projects.findIndex((project) => project.id === over.id);
        
        return arrayMove(projects, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

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

  const addProject = async () => {
    const newProject = {
      id: crypto.randomUUID(), // ID único real
      title: 'Novo Projeto',
      status: 'Em andamento',
      due_date: new Date().toISOString().split('T')[0],
      tasks: []
    };
    setProjects([...projects, newProject]);
    await syncWithSupabase([...projects, newProject]);
  }

  const updateProject = async (updatedProject) => {
    const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(newProjects);
    await syncWithSupabase(newProjects);
  };
  
  const deleteProject = async (projectId) => {
    try {
      // Removendo do banco de dados
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
  
      if (error) {
        console.error("Erro ao deletar projeto:", error);
        return;
      }
  
      // Removendo do estado local
      const newProjects = projects.filter(p => p.id !== projectId);
      setProjects(newProjects);
  
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
    }
  };
  

  const addTask = (projectId) => {
    const taskText = newTask[projectId]?.text || "";
    if (!taskText) return;
  
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      category: newTask[projectId]?.category || "Trabalho"
    };
  
    setProjects((prev) =>
      prev.map(p => p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)
    );
  
    setNewTask((prev) => ({
      ...prev,
      [projectId]: { text: "", category: "Trabalho" }
    }));
  };

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

  const handleEditProjectTitle = (e, project) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setEditingProject(null);
      updateProject({ ...project, title: e.target.value });
    }
  };

  return (
    <div className="flex h-screen p-4">
      {/* Sidebar */}
      <div className="w-20 bg-my-bg bg-cover rounded-full flex flex-col items-center py-8 space-y-6 shadow-lg mx-4 mr-14">
        <div className=" bg-white/20 rounded-full backdrop-blur-sm">
        {/* UserSettings */}
        <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Avatar
            isBordered
            as="button"
            className="transition-transform"
            />
          </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" >
            
            {/* <DropdownItem onClick={syncWithSupabase}>
            Sincronizar dados
            </DropdownItem> */}

            <DropdownItem className="text-danger" color="danger">
                <Button className="w-full bg-transparent ">
                  <Link to="/">Sair</Link>
                </Button>
            </DropdownItem>

          </DropdownMenu>
        </Dropdown>

        </div>
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
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        
        <div className="flex-1 flex flex-col">
          {/* HEADER */}
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
            </div>
          </header>

          <SortableContext items={filteredProjects.map(p => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project, index) => (
                <SortableProject 
                  key={project.id} 
                  project={project} 
                  index={index}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <StatusSelector project={project} />
                  </div>

                  <div className="space-y-4">
                    {editingProject === project.id ? (
                      <input
                        value={project.title}
                        onChange={(e) => updateProject({ ...project, title: e.target.value })}
                        onKeyDown={(e) => handleEditProjectTitle(e, project)}
                        className="w-full font-medium mb-2 border-b border-gray-200 focus:outline-none"
                      />
                    ) : (
                      <h3 className="font-medium mb-2">{project.title}</h3>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>🗓 {project.due_date}</span>
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
                </SortableProject>
              ))}
            </div>
          </SortableContext>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <h3 className="font-medium">
                  {filteredProjects.find(p => p.id === activeId)?.title}
                </h3>
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}

export default Dashboard;