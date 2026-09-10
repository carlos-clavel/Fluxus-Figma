export type WithdrawalMode = "car" | "walk" | "none";
export type StudentStatus = "waiting" | "coming" | "meeting" | "out";

export interface Guardian {
  id: string;
  name: string;
  relation: string;
  phone: string;
  photo?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  institution: string;
  status: StudentStatus;
  guardians: Guardian[];
  receptionId: string | null;
  mode?: WithdrawalMode;
  noticeTime?: string;
  exitTime?: string;
  confirmedBy?: string;
}

export interface Reception {
  id: string;
  name: string;
  location: string;
}

export interface Notice {
  id: string;
  studentId: string;
  guardianId: string;
  mode: WithdrawalMode;
  time: string;
}

export const receptions: Reception[] = [
  { id: "r1", name: "Recepção Principal", location: "Av. Coronel Marcos, 540" },
  { id: "r2", name: "Portão Sul", location: "Rua das Palmeiras, s/n" },
  { id: "r3", name: "Portão Norte", location: "Travessa Boa Vista, 12" },
];

export const guardians: Guardian[] = [
  { id: "g1", name: "Ana Andrade", relation: "Mãe", phone: "(51) 99201-4432" },
  { id: "g2", name: "Carlos Andrade", relation: "Pai", phone: "(51) 98102-3311" },
  { id: "g3", name: "Fernanda Lins", relation: "Mãe", phone: "(51) 99340-7721" },
  { id: "g4", name: "Roberto Alencar", relation: "Pai", phone: "(51) 98800-1122" },
  { id: "g5", name: "Márcia de Sá", relation: "Mãe", phone: "(51) 99120-5543" },
  { id: "g6", name: "Paulo de Sá", relation: "Pai", phone: "(51) 98200-8876" },
  { id: "g7", name: "Camila Freijó", relation: "Mãe", phone: "(51) 99550-6634" },
  { id: "g8", name: "Ricardo Schimdt", relation: "Pai", phone: "(51) 98390-2210" },
  { id: "g9", name: "Luciana Schinder", relation: "Responsável", phone: "(51) 99670-8821" },
  { id: "g10", name: "Tatiane Costa", relation: "Mãe", phone: "(51) 99230-4451" },
  { id: "g11", name: "Jorge Ferreira", relation: "Pai", phone: "(51) 98400-3312" },
  { id: "g12", name: "Sandra Paiva", relation: "Mãe", phone: "(51) 99780-1122" },
];

export const students: Student[] = [
  {
    id: "s1",
    name: "Lucas Andrade",
    grade: "7º ano A",
    institution: "Escola Estadual Boa Vista",
    status: "waiting",
    guardians: [guardians[0], guardians[1]],
    receptionId: "r1",
  },
  {
    id: "s2",
    name: "Sofia Lins",
    grade: "5º ano C",
    institution: "Escola Estadual Boa Vista",
    status: "waiting",
    guardians: [guardians[2]],
    receptionId: "r1",
  },
  {
    id: "s3",
    name: "Davi Alencar",
    grade: "3º EM",
    institution: "Escola Estadual Boa Vista",
    status: "waiting",
    guardians: [guardians[3]],
    receptionId: "r1",
  },
  {
    id: "s4",
    name: "Pedro de Sá",
    grade: "9º ano B",
    institution: "Escola Estadual Boa Vista",
    status: "coming",
    mode: "car",
    noticeTime: "17:28",
    guardians: [guardians[4], guardians[5]],
    receptionId: "r1",
    confirmedBy: "g5",
  },
  {
    id: "s5",
    name: "Helena Freijó",
    grade: "6º ano A",
    institution: "Escola Estadual Boa Vista",
    status: "coming",
    mode: "walk",
    noticeTime: "17:31",
    guardians: [guardians[6]],
    receptionId: "r1",
    confirmedBy: "g7",
  },
  {
    id: "s6",
    name: "Beatriz Schimdt",
    grade: "4º ano B",
    institution: "Escola Estadual Boa Vista",
    status: "meeting",
    mode: "car",
    noticeTime: "17:24",
    guardians: [guardians[7]],
    receptionId: "r1",
    confirmedBy: "g8",
  },
  {
    id: "s7",
    name: "Theo Schinder",
    grade: "8º ano A",
    institution: "Escola Estadual Boa Vista",
    status: "meeting",
    mode: "walk",
    noticeTime: "17:26",
    guardians: [guardians[8]],
    receptionId: "r1",
    confirmedBy: "g9",
  },
  {
    id: "s8",
    name: "Júlia Costa",
    grade: "2º EM",
    institution: "Escola Estadual Boa Vista",
    status: "out",
    exitTime: "17:38",
    guardians: [guardians[9]],
    receptionId: "r1",
    confirmedBy: "g10",
  },
  {
    id: "s9",
    name: "Davi Ferreira",
    grade: "3º EM",
    institution: "Escola Estadual Boa Vista",
    status: "out",
    exitTime: "17:42",
    guardians: [guardians[10]],
    receptionId: "r1",
    confirmedBy: "g11",
  },
  {
    id: "s10",
    name: "Rafael Paiva",
    grade: "7º EM",
    institution: "Escola Estadual Boa Vista",
    status: "out",
    exitTime: "17:30",
    guardians: [guardians[11]],
    receptionId: "r1",
    confirmedBy: "g12",
  },
  {
    id: "s11",
    name: "Mariana Souza",
    grade: "4º ano A",
    institution: "Escola Estadual Boa Vista",
    status: "waiting",
    guardians: [guardians[0]],
    receptionId: "r2",
  },
  {
    id: "s12",
    name: "Gabriel Nunes",
    grade: "8º ano B",
    institution: "Escola Estadual Boa Vista",
    status: "coming",
    mode: "car",
    noticeTime: "17:33",
    guardians: [guardians[3]],
    receptionId: "r2",
    confirmedBy: "g4",
  },
];

export const notices: Notice[] = [
  { id: "n1", studentId: "s4", guardianId: "g5", mode: "car", time: "17:28" },
  { id: "n2", studentId: "s5", guardianId: "g7", mode: "walk", time: "17:31" },
  { id: "n3", studentId: "s6", guardianId: "g8", mode: "car", time: "17:24" },
  { id: "n4", studentId: "s7", guardianId: "g9", mode: "walk", time: "17:26" },
  { id: "n5", studentId: "s12", guardianId: "g4", mode: "car", time: "17:33" },
];
