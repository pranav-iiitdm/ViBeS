import {
  type Project,
  type Publication,
  type TeamMember,
  type Student,
  type InsertProject,
  type InsertPublication,
  type InsertTeamMember,
  type InsertStudent
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  addProject(project: InsertProject): Promise<Project>;

  // Publications
  getPublications(): Promise<Publication[]>;
  addPublication(publication: InsertPublication): Promise<Publication>;

  // Team
  getTeamMembers(): Promise<TeamMember[]>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;

  // Students
  getStudents(): Promise<Student[]>;
  addStudent(student: InsertStudent): Promise<Student>;
}

export class MemStorage implements IStorage {
  private projects: Project[] = [
    {
      id: 1,
      title: "Advanced Facial Recognition System",
      abstract: "Development of a novel facial recognition system using deep learning.",
      authors: ["Dr. Jane Smith", "John Doe"],
      datasetLink: "https://dataset.vibeslab.org/face-recognition",
      githubLink: "https://github.com/vibeslab/face-recognition",
      category: "biometrics"
    },
    {
      id: 2,
      title: "Edge Computing for Real-time Video Analysis",
      abstract: "Implementing efficient video processing algorithms on edge devices.",
      authors: ["Dr. Mike Johnson", "Sarah Williams"],
      datasetLink: "https://dataset.vibeslab.org/edge-video",
      githubLink: "https://github.com/vibeslab/edge-video",
      category: "edge_computing"
    }
  ];

  private publications: Publication[] = [
    {
      id: 1,
      title: "Deep Learning Approaches in Biometric Recognition",
      authors: ["Dr. Jane Smith", "Prof. Robert Brown"],
      year: 2024,
      venue: "IEEE Conference on Computer Vision",
      link: "https://doi.org/10.1234/paper1",
      abstract: "A comprehensive survey of deep learning methods in biometric recognition systems."
    }
  ];

  private teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Dr. Jane Smith",
      role: "Principal Investigator",
      bio: "Leading researcher in computer vision and biometrics with over 15 years of experience.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      googleScholarUrl: "https://scholar.google.com/citations?user=example",
      researchGateUrl: "https://www.researchgate.net/profile/example",
      researchInterests: ["Computer Vision", "Deep Learning", "Biometrics"]
    },
    {
      id: 2,
      name: "Dr. John Davis",
      role: "Senior Researcher",
      bio: "Expert in deep learning and pattern recognition systems.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      googleScholarUrl: "https://scholar.google.com/citations?user=example2",
      researchGateUrl: "https://www.researchgate.net/profile/example2",
      researchInterests: ["Pattern Recognition", "Machine Learning", "Neural Networks"]
    }
  ];

  private students: Student[] = [
    {
      id: 1,
      name: "John Doe",
      degree: "Ph.D. Student",
      projects: [
        {
          title: "Advanced Facial Recognition System",
          description: "Working on improving facial recognition accuracy using transformer models."
        }
      ],
      researchInterests: ["Deep Learning", "Computer Vision"],
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      degree: "Masters Student",
      projects: [
        {
          title: "Edge Computing for IoT",
          description: "Developing efficient algorithms for edge devices."
        }
      ],
      researchInterests: ["Edge Computing", "IoT"],
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    }
  ];

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return this.projects.filter(p => p.category === category);
  }

  async addProject(project: InsertProject): Promise<Project> {
    const newProject = {
      ...project,
      id: this.projects.length + 1
    };
    this.projects.push(newProject);
    return newProject;
  }

  async getPublications(): Promise<Publication[]> {
    return this.publications;
  }

  async addPublication(publication: InsertPublication): Promise<Publication> {
    const newPublication = {
      ...publication,
      id: this.publications.length + 1
    };
    this.publications.push(newPublication);
    return newPublication;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return this.teamMembers;
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const newMember = {
      ...member,
      id: this.teamMembers.length + 1
    };
    this.teamMembers.push(newMember);
    return newMember;
  }

  async getStudents(): Promise<Student[]> {
    return this.students;
  }

  async addStudent(student: InsertStudent): Promise<Student> {
    const newStudent = {
      ...student,
      id: this.students.length + 1
    };
    this.students.push(newStudent);
    return newStudent;
  }
}

export const storage = new MemStorage();