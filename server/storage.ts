import {
  type Project,
  type Publication,
  type TeamMember,
  type Student,
  type InsertProject,
  type InsertPublication,
  type InsertTeamMember,
  type InsertStudent
} from "../shared/schema.js";
import { supabase } from '../shared/supabase.js';

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

export class SupabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return data;
  }

  async addProject(project: InsertProject): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPublications(): Promise<Publication[]> {
    const { data, error } = await supabase
      .from('publications')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async addPublication(publication: InsertPublication): Promise<Publication> {
    const { data, error } = await supabase
      .from('publications')
      .insert([publication])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async addStudent(student: InsertStudent): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Export the initial data for seeding the database
export const initialProjects = [
  {
    id: 1,
    title: "Exploring periocular biometrics for cattle identification in the visible spectrum",
    abstract: "The research focuses on developing a robust and efficient cattle identification system using periocular biometrics, designed for real-world deployment in farms and livestock management. The system aims to provide a tamper-proof alternative to traditional identification methods by leveraging deep learning models for periocular segmentation and feature extraction. It must be capable of handling challenges such as variations in lighting, occlusions, and diverse cattle breeds, ensuring high accuracy and reliability. ",
    authors: ["Ananya M"],
    datasetLink: "https://dataset.vibeslab.org/face-recognition",
    githubLink: "https://github.com/vibeslab/face-recognition",
    date: "2024-01-23",
    category: "biometrics"
  },
  {
    id: 2,
    title: "Monocular 3D Pedestrian Detection Using Transformers.",
    abstract: "The goal of 3D pedestrian detection is to accurately determine the position, orientation, and motion of pedestrians in real time, enabling systems to predict their behavior and take proactive measures to prevent accidents. Using the transformers in this task, can improve the pedestrian localization and depth estimation as transformers are capable of capturing the long range dependencies.",
    authors: ["V Vaagdhevi"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "visual_surveillance"
  },
  {
    id: 3,
    title: "Enhancing Biometric Accuracy by Preventing False Positives with High-Resolution Images",
    abstract: "This project focuses on enhancing biometric system accuracy by improving real biometric images using ESRGAN (Enhanced Super-Resolution Generative Adversarial Network) and VDSR (Very DeepSuper-Resolution). Additionally, GFP-GAN (Generative Facial Prior GAN) is used to generatehigh-resolution fake images, assessing system vulnerabilities to spoofing attacks. By trainingsuper-resolution models on downscaled high-quality images, we refine biometric inputs and analyze how biometric systems without liveness detection respond to AI-generated forgeries. The study evaluates false acceptance and rejection rates, offering insights into improving biometric authentication security and robustness.",
    authors: ["A Manasa Reddy"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "biometrics"
  },
  {
    id: 4,
    title: "Enhancing Vehicle Safety on Non-Favourable Roads: An AI-Driven Driver Assistance System with Dash Cameras",
    abstract: "This project integrates Advanced Driver Assistance Systems (ADAS) with dash cameras to improve vehicle safety on challenging roads. It employs AI techniques such as panoptic segmentation and SOLOv2 for pedestrian detection and segmentation. The Optimal Trajectory Generation Algorithm (OTGA) is used for real-time pedestrian movement prediction, enabling proactive hazard analysis and safety measures.",
    authors: ["Haindavi Pichikala"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "visual_surveillance"
  },
  {
    id: 5,
    title: "Robust Light weight Pedestrian Detection algorithm for AMCR",
    abstract: "The research focuses on developing a robust lightweight pedestrian detection algorithm for real-time pedestrian detection, suitable for edge devices, especially for AMCR (Autonomous Mobile Camera Robot). The algorithm should be able to detect pedestrians in challenging real time conditions such as occlusion, multi-scale pedestrian, pedestrians at different view angles (including bird's eye view), rainy and fogy condition, day and night conditions.",
    authors: ["Sukesh Babu V S"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "edge_computing"
  },
  {
    id: 6,
    title: "Pose Invariant Face Recognition Model",
    abstract: "The research focuses on developing a pose-invariant human face recognition system by bridging the gap between 2D and 3D face recognition techniques. Traditional 2D face recognition systems struggle with A-PIE (Aging, Pose, Illumination, and Expression) challenges, while 3D face recognition requires complex data acquisition. To address these limitations, we perform 3D reconstruction from 2D images, enabling a hybrid approach that combines discriminative 2D features with structural 3D features. By integrating these multi-dimensional features for similarity checks, we achieve improved pose-invariant recognition. Encouraged by these results, we aim to extend this approach to cattle biometric identification.",
    authors: ["Anu Jexline Joseph"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: ""
  },
  {
    id: 7,
    title: "Walking Direction Estimation, Adversarial Learning, Multi-Task Learning, Self Supervised Learning ",
    abstract: "",
    authors: ["Vishnuram AV "],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "biometrics"
  },
  {
    id: 8,
    title: "Robust Pedestrian Detection in Challenging Environments Using YOLO",
    abstract: "Project focuses on Pedestrian Detection in a Robust Environment using YOLO, specifically in foggy and rainy conditions. You are using a custom dataset collected in a foggy environment and also exploring datasets for rainy conditions to enhance the model's robustness. The project involves fine-tuning YOLOv12 and YOLOv9 to improve pedestrian detection under adverse weather conditions. Your approach includes dataset augmentation, model optimization, and performance evaluation. Future work includes extending the model to handle extreme weather scenarios, integrating real-time detection capabilities, and exploring transformer-based architectures like DETR for enhanced object detection in challenging environments.",
    authors: ["Pawan Kumar Bamne"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "edge_computing"
  },
  {
    id: 9,
    title: "Robust Gait Recognition: Addressing Uncertainty Using Statistical Inference and Learning Methodologies",
    abstract: "",
    authors: ["Hilton Raj"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "biometrics"
  },
  {
    id: 10,
    title: "Multimodal Cattle Biometrics",
    abstract: "My research focuses on multimodal cattle biometrics. I have been working on data collection and multi-modal cattle identification using images of the face, muzzle, iris, full body, and ear. I am developing deep learning models for both individual biometric training and multi-modal biometric systems. In multi-modal biometrics, I am exploring score-level and feature fusion techniques. Additionally, I have created a dataset containing images of 30 cattle face subjects with 864 images.",
    authors: ["Ramkumar T"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "biometrics"
  },
  {
    id: 11,
    title: "Hybrid Deep Learning Models for Detecting Fake Faces",
    abstract: "This research focuses on building a powerful deep learning model to detect deepfake facial images created by advanced generative models like GANs and diffusion models. By exploring cutting-edge machine learning techniques, we aim to improve the accuracy and reliability of deepfake detection, helping to counter the growing challenge of AI-generated fake images.",
    authors: ["Yaswanth Nalajala"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "generative_models"
  },
  {
    id: 12,
    title: "Gen AI for 3D Pedestrian Detection ",
    abstract: "This project focuses on improving 3D pedestrian detection in autonomous systems using Generative AI techniques. By leveraging datasets like JRDB, we enhance object detection models to improve accuracy and reliability in identifying pedestrians in complex environments.",
    authors: ["Aneesh Deepak RM"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "edge_computing"
  },
  {
    id: 13,
    title: "AI-Powered Cattle Recognition and Assistance",
    abstract: "The AI-Powered Cattle Recognition and Assistance system leverages advanced computer vision and artificial intelligence to identify individual cows through their unique muzzle patterns, providing a more secure and permanent identification method than traditional tagging. This biometric approach ensures accurate record-keeping and traceability while reducing identification errors. Future enhancements will include disease detection using machine learning, an AI-powered chatbot for instant veterinary assistance, and a comprehensive medical and vaccination management system. By integrating these features, the system improves livestock health, enables early disease detection, and enhances farm productivity, making it a valuable tool for both small and large-scale cattle management.",
    authors: ["Sai Dheeraj"],
    datasetLink: "",
    githubLink: "",
    date: "",
    category: "generative_models"
  },   
];

export const initialPublications = [
  {
    id: 1,
    title: "Perspective Distortion Model for Pedestrian Trajectory Prediction for Consumer Applications",
    authors: ["S. Gundreddy", "R. Ramkumar", "R. Raman", "K. Muhammad", "S. Bakshi"],
    year: 2024,
    venue: "IEEE Transactions on Consumer Electronics (Volume: 70, Issue: 1)",
    link: "https://ieeexplore.ieee.org/document/10258358",
    abstract: "Predicting human motion and interpreting the trajectory of a pedestrian is necessary for consumer electronics applications ranging from smart visual surveillance to visual assistance of autonomous vehicles. The majority of existing work in trajectory prediction from camera sensors as input has been investigated mostly in the top-down view (ETH and UCY datasets). However, accurate prediction of pedestrian trajectory used in first person/third person view of visual surveillance and autonomous driving is still a challenging task. With the increasing deployment of these IoT devices and the integration of AI for decision-making, human trajectory prediction can significantly contribute to improving consumer experiences and safety in these contexts. In this article, we propose a lightweight geometry-based Perspective Distortion Model (PDM) that leverages first-person/third-person view property of perspective distortion for long-term prediction. The qualitative result shows a promising prediction of future positions with 2, 3, 4, 6 seconds in advance over videos taken at 30 fps.Our proposed model quantitatively achieves state-of-the-art performance in terms of the Average Displacement Error (ADE) while tested on a self-created dataset (https://github.com/RahulRaman2/DATABASE) and Oxford Town Centre dataset.",
    type: "journal"
  },
  {
    id: 2,
    title: "Robust Pedestrian Detection via Curated Training on Created Dataset",
    authors: ["VS Sukesh Babu", "R. Raman"],
    year: 2024,
    venue: "21st IEEE INDICON, IIT Kharagpur",
    link: null,
    abstract: null,
    type: "conference"
  },
  {
    id: 3,
    title: "Deep Learning for Walking Direction Estimation",
    authors: ["Hilton Raj", "Vishnuram AV", "R. Raman"],
    year: 2024,
    venue: "21st IEEE INDICON, IIT Kharagpur",
    link: null,
    abstract: null,
    type: "conference"
  },
  {
    id: 4,
    title: "Walking Direction Estimation using Silhouette and Skeletal Representations",
    authors: ["Vishnuram AV", "Hilton Raj" , "R. Raman"],
    year: 2024,
    venue: "9th International Conference on Computer Vision & Image Processing (CVIP 2024), IIITDM Kancheepuram",
    link: null,
    abstract: null,
    type: "conference"
  },
  {
    id: 5,
    title: "Robust Pedestrian Detection via Curated Training via Enriched Dataset",
    authors: ["VS Sukesh Babu", "R. Raman"],
    year: 2024,
    venue: "9th International Conference on Computer Vision & Image Processing (CVIP 2024), IIITDM Kancheepuram",
    link: null,
    abstract: null,
    type: "conference"
  },
  {
    id: 6,
    title: "Pose-Invariant 2D Face Verification by Combining MICA and 2D Features",
    authors: ["Anu Jexline", "R. Raman"],
    year: 2024,
    venue: "9th International Conference on Computer Vision & Image Processing (CVIP 2024), IIITDM Kancheepuram",
    link: null,
    abstract: null,
    type: "conference"
  },
  {
    id: 7,
    title: "Cattle Identification through Multi-Biometric Features and Edge Device",
    authors: ["Apurba Roy", "R. Raman"],
    year: 2024,
    venue: "9th International Conference on Computer Vision & Image Processing (CVIP 2024), IIITDM Kancheepuram",
    link: null,
    abstract: null,
    type: "conference"
  },
  {
    id: 8,
    title: "Object-Based Quadrant Triggering for Smart Energy Management System",
    authors: ["Apurba Roy", "R. Raman"],
    year: 2024,
    venue: "9th International Conference on Computer Vision & Image Processing (CVIP 2024), IIITDM Kancheepuram",
    link: null,
    abstract: null,
    type: "conference"
  },
  {
    id: 9,
    title: "Pedestrian Direction Estimation: An Approach via Perspective Distortion Patterns",
    authors: ["VS Sukesh Babu", "R. Raman"],
    year: 2023,
    venue: "4th International Conference on Innovative Trends in Information Technology (ICITIIT)",
    link: "https://ieeexplore.ieee.org/abstract/document/10068588",
    abstract: "Knowledge of pedestrian's walking direction is very crucial in multiple domains of video processing. This paper proposes a graph based, robust and light weighted model for direction estimation of pedestrian's walk by using the property of perspective distortion. Here perspective distortion pattern is used as an advantage in estimation of direction. The graph-based solution uses 3 parallel approaches for estimating the direction: Perspective Distortion Graph, Centroid Displacement and Clustering of Vanishing point. A pedestrian in a frame can be identified by bounding boxes. The temporal dimensional features of bounding boxes are height and width and these features changes for a particular object from frame to frame as the objects moves. These changes are unique for each direction for each object. These changes in dimension along with clustering of vanishing point and centroid displacement is used for the assesment of the pedestrian's walk direction. All the existing approaches need some sort of pre-processing on the frames, which makes the model more complex and time consuming. In the proposed model, the video sequence is applied on YOLO V4 algorithm and bounding boxes are obtained. By analysing the changes from frame to frame for the dimensions, graphs are plotted and minimum and maximum extremas are detected form the graph by eliminating soft extremas. After that envelope is placed for the graph and an average line is drawn based on the envelope, which will give the inference about the direction of walk of the pedestrian. The perspective distortion graph will not give accurate estimation for all directions. So, Centroid displacement and clustering of vanishing point are also used for direction estimation. The result obtained from the three methods are combined and form a robust model. For accurately estimating walk direction, the movement is limited to 8 different directions. For experiment, NITR Conscious Walk dataset and self-acquired dataset are used. With balanced accuracy of 97.003% and 96.25% and a false positive rate of 0.63% and 0.65%, respectively, the model produces good results for the above dataset.",
    type: "conference"
  },
  {
    id: 10,
    title: "Muzzle Based Identification of Cattle Using KAZE",
    authors: ["K.Kaushik","D.J.Reddy" ,"R. Raman"],
    year: 2023,
    venue: "4th International Conference on Innovative Trends in Information Technology (ICITIIT), Kottayam, India",
    link: "https://ieeexplore.ieee.org/document/10068662",
    abstract: "Biometric Identification for animals has been an emerging research field in computer vision. Biometric Identification plays an important role in monitoring diseases, vaccination, planning and control of the produce, and also in ownership assignment. There are several Traditional identification methods like the Ear-Tagging, Ear-Notching, Ear-Tattooing, Freeze-Branding, Hot-Branding and Electrical methods using RFID. The Traditional methods have been invasive, easily duplicable. They are also known for their low accuracies in identification as they are vulnerable to losses. A system with better performance is much needed in this field. Visual Animal Biometrics is gaining wide acceptance all over the world as it provides with better results. This paper aims to explain in detail the implementation of a feature extraction technique called KAZE and through experimental analysis show that it performs better than other feature extraction algorithms",
    type: "conference"
  }
];

export const initialTeamMembers = [
  {
    id: 1,
    name: "Dr. Rahul Raman",
    role: "Sr. Assistant Professor",
    bio: "Sr. Assistant Professor at IIITDM Kancheepuram. Expert in computer vision and deep learning.",
    image: "/rahulRaman.jpeg",
    googleScholarUrl: "https://scholar.google.com/citations?user=nPyS_KkAAAAJ&hl=en&oi=sra",
    researchGateUrl: "https://www.researchgate.net/profile/example",
    linkedinUrl: null,
    researchInterests: ["Image Processing", "Computer Vision", "Machine Learning", "Visual Surveillance", "Biometric Security"],
    additionalInfo: `\n\n\n ### Earlier:\n\n- **Assistant Professor (3.5 Years)**, Department of Analytics, School of Computer Science and Engineering, VIT University Vellore, Tamil Nadu, India\n- **Doctoral Research Scholar (3.5 Years)**, Computer Vision Research Lab, Department of Computer Science and Engineering, National Institute of Technology, Rourkela, India\n\n- **Lecturer (1 year)**, Department of Computer Science & Engineering, R.R. Inst. of Technology, Bangalore,\n\n- **Master Research Scholar (2 years)**, Computer Vision Research Lab, Department of Computer Science & Engineering , National Institute of Technology, Rourkela, India\n\n### Stress Busters:\n\n- Photography, Music(Tabla, Harmonica), Pencil-Sketches, Animations`
  },
  {
    id: 2,
    name: "Sukesh Babu V S",
    role: "Ph.D. Scholar",
    bio: "Pursuing Ph.D. in the domain of intelligent video surveillance and pedestrian detection.",
    image: "/sukesh.jpg",
    googleScholarUrl: "https://scholar.google.com/citations?user=NDch9p8AAAAJ&amp;hl=en",
    researchGateUrl: null,
    linkedinUrl: "https://www.linkedin.com/in/sukesh-babu-v-s-84417b44/",
    researchInterests: ["Visual Analytics", "Computer Vision", "Deep Learning", "Artificial Intelligence"],
    additionalInfo: "\n\n ### Earlier:\n\n- **Assistant Professor** in Mahaguru Institute of Technology (Formerly Sri Vellapally Natesan College of Engineering) form 13/06/2012 to 10/01/2022 (9.8 years).\n- **Lecturer** in Visveswaraya Institute of engineering Technology, Mattakkara, Kottayam, from 15/12/2007 to 31/05/2010 (2.6 years)."
  },
  {
    id: 3,
    name: "Anu Jexline",
    role: "Ph.D. Scholar",
    bio: "Pursuing Ph.D. in the domain of intelligent video surveillance and pedestrian detection.",
    image: "/anu.jpg",
    googleScholarUrl: "https://scholar.google.com/citations?user=example2",
    researchGateUrl: "https://www.researchgate.net/profile/example2",
    linkedinUrl: null,
    researchInterests: ["Visual analytics", "Computer Vision", "Deep Learning", "Artificial Intelligence"],
    additionalInfo: ""
  }
];

export const initialStudents = [
  {
    id: 1,
    name: "Ram Kumar T",
    bio: "M.Tech Student",
    projects: [
      {
        title: "Advanced Facial Recognition System",
        description: "Working on improving facial recognition accuracy using transformer models."
      }
    ],
    researchInterests: ["Deep Learning", "Computer Vision"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "PG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 2,
    name: "Pavan Kumar",
    bio: "Masters Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "PG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 3,
    name: "P Sri Hanidevi",
    bio: "Masters Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "PG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 4,
    name: "A Manasa Reddy",
    bio: "Masters Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "PG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 5,
    name: "V Vaagdevi",
    bio: "Masters Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "PG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 6,
    name: "Hilton Paul",
    bio: "Bachelors Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "UG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 7,
    name: "Vishnuram A V",
    bio: "Bachelors Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "UG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 8,
    name: "Basab Ghosh",
    bio: "Bachelors Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "UG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 9,
    name: "Girik Khullar",
    bio: "Bachelors Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "UG",
    additionalInfo: "",
    googleScholarUrl: "https://scholar.google.co.in/citations?user=d51X7rUAAAAJ&amp;hl=en",
    researchGateUrl: "",
    linkedinUrl: "https://www.linkedin.com/in/girik-khullar/"
  },
  {
    id: 10,
    name: "Ananya M",
    bio: "Bachelors Student",
    projects: [
      {
        title: "Edge Computing for IoT",
        description: "Developing efficient algorithms for edge devices."
      }
    ],
    researchInterests: ["Edge Computing", "IoT"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "UG",
    additionalInfo: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 11,
    name: "Sahith",
    bio: "Currently Software Engineer (R&D) @TVS Motor Company",
    projects: [
      {
        title: "Visual Surveillance",
        description: "Developed modules for real-time face detection and pedestrian property analysis for autonomous vehicles."
      }
    ],
    researchInterests: ["Visual Surveillance", "Biometrics", "Deep Learning"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "Alumni",
    additionalInfo: `- Distinguished Speaker, reviewer, session chair, hackathons organizer, Execomm member in IEEE Vehicular \n- Technology Society and reviewer of IEEE journal Intelligent Transportation Systems.\n- Coordinator for workshops on computer vision at IIITDM Kancheepuram.`,
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 12,
    name: "Apurba",
    bio: "Currently Software Engineer @Trimble",
    projects: [
      {
        title: "Biometrics",
        description: "Cattle Identification through Multi-Biometric Features and Edge Device"
      }
    ],
    researchInterests: ["Visual Surveillance", "Biometrics", "Deep Learning"],
    image: "/Apurba.jpg",
    category: "Alumni",
    additionalInfo: `- Attended 9th International Conference on Computer Vision & Image Processing 19-21 December, 2024 | IIITDM Kancheepuram, Chennai - 600127, India \n- Developed Attenda, an application that automates attendance tracking using WiFi and hotspot technology.\n- Worked on the Pixelor project, a large-scale image processing application. Identified performance bottlenecks in the Pixelor application using profiling tools such as GProf, GCov.`,
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  },
  {
    id: 13,
    name: "Ram Kumar R",
    bio: "Currently pursuing M.Tech @IIT Madras",
    projects: [
      {
        title: "Computer Vision",
        description: "Monocular Depth Analysis Controlled GPS Denied AGV Navigation for Seamless Tracking"
      }
    ],
    researchInterests: ["Computer Vision", "Deep Learning"],
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLeor7Lf4ePn6eqrsbW5vsHIzM7a3d60ur3BxsjR1NbN0dPX2tzr7O29wsX2DjRMAAADaUlEQVR4nO2bW3LkIAwADYi3be5/25iZZB4bxyDZgqkt+ivZn+0SQgahTNNgMBgMBoPBYDAYDAaDwWCaAGBSG/mn3i53AFQMxt8xdpm6ewE466XU4getpZlVVy9YjHgKPcRE6Ke1KclfRnct2UkLprATpWe05g5W4PzfShmZVHOneGh0D1ZjK5j/yKZ3lpZLCPZ46R7Bcu2sKuN0i1Uzp1gXpxvN8qpeSQjTyMkgAiV0aJFWMGOctnrVpLZXJ/k3DRYQAi5Q2wJGdqkFqZThXj98oHKouK2wGZVhzqra78s/oXK8VobgxF2rHMVpY+WUipSU2goo5/pBoqTUtn6cZ+OV5sScVLTV4y0Kjhgp4fmOVajT3TuMUshTyxPG8kmr5xnGmnBCiu8C8b9JMS7fRyY6vSQwSi0fWDwn9YmfGaBKBUap1dOctGU8JVC3H29LaCGePHnvWKT104lVCgIpUMwXd1JR4KxSGcr+Y917NwhFXTIrTYQ7coNeHjhsVnFnVGZFtTyZL6IPFM7Js/YRfgBcWWduAz2sEN082e55prrPwV+iXii89T3i1NKp8tWhzWsDzqpxnDKlO6AW7J3q38BymFjSdHlvP3pu12LuYHRjdUHuaWlhew5xgApe6Fex7RffLUoPrWmxRkipM1KKNLv+IzjfuBjnuOTv3GcYAawvQN8Rqvy/K7dEG5L5Po4ak4KdF9dpvAtWtdhkvL5l02ue538RPoWoYG0oBpOKQUh9WNJz3pvZqSYRg9VZL3bL017B8iFyxwsmZ2uFniFLC2MpBYh7024VWt4yVQpQ9jiLDr1kYGhaHw+71WiJdHGTaosSMpP2kOnKWwTMlWfyAvq63ic4T+2//ta66L4M9iqju1Y6Xx+Kk5N4q9NTJhDP7bl9rZOZZS/Lple2S8UJJ+IYQhEt6ImF7EShoJasq1P8DeIjBGecMoRYAbeT0Ohsh8Cy797AdmjpT9gItEEtIL4vTULiPoTEx0YsGpHslLlJGr5eqs3iZRCN2tTKSVTPMNGnDwjoVPcgQX1SJ1pVherE7AhJqq6t3Wzr3amq67hHqvPImtMxceiVjimn+koaWT5DTaq3zahMcf2A8ucC5yhXdfqEG51UWrx23+InvphSLb97PxQz3cv2FN++VQeKyzcYDAaDwaA9XxcLKh2A6JUdAAAAAElFTkSuQmCC",
    category: "Alumni",
    additionalInfo: `- Attended 9th International Conference on Computer Vision & Image Processing 19-21 December, 2024 | IIITDM Kancheepuram, Chennai - 600127, India \n- Developed Attenda, an application that automates attendance tracking using WiFi and hotspot technology.\n- Worked on the Pixelor project, a large-scale image processing application. Identified performance bottlenecks in the Pixelor application using profiling tools such as GProf, GCov.`,
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: ""
  }
];