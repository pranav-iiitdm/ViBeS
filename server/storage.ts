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
      image: "https://example.com/jane-smith.jpg",
      publications: [
        { title: "Deep Learning in Biometrics", link: "https://doi.org/10.1234/paper2" }
      ],
      researchInterests: ["Computer Vision", "Deep Learning", "Biometrics"]
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
      image: "https://example.com/john-doe.jpg"
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