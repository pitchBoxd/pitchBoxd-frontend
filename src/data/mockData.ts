export interface Player {
  id: string;
  name: string;
  nameKr: string;
  position: string;
  number: number;
  avgRating: number;
  totalRatings: number;
  isSubstitute?: boolean;
  teamId?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  likes: number;
  createdAt: string;
  isModified?: boolean;
}

export interface Match {
  id: string;
  round: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  venue: string;
  avgRating: number;
  homeAvgRating: number;
  awayAvgRating: number;
  totalRatings: number;
  homeTeamLogo: string;
  awayTeamLogo: string;
  isFeatured?: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  stadium: string;
  city: string;
}

export const teams: Team[] = [
  { id: "fcseoul", name: "FC 서울", shortName: "서울", logo: "🔴", stadium: "서울월드컵경기장", city: "서울" },
  { id: "suwon", name: "수원 삼성", shortName: "수원삼성", logo: "🔵", stadium: "수원월드컵경기장", city: "수원" },
  { id: "jeonbuk", name: "전북 현대", shortName: "전북", logo: "🟢", stadium: "전주월드컵경기장", city: "전주" },
  { id: "ulsan", name: "울산 HD", shortName: "울산", logo: "🟠", stadium: "울산문수축구경기장", city: "울산" },
  { id: "daegu", name: "대구 FC", shortName: "대구", logo: "🔵", stadium: "DGB대구은행파크", city: "대구" },
  { id: "incheon", name: "인천 유나이티드", shortName: "인천", logo: "🔷", stadium: "인천축구전용경기장", city: "인천" },
  { id: "pohang", name: "포항 스틸러스", shortName: "포항", logo: "🔴", stadium: "포항스틸야드", city: "포항" },
  { id: "jeju", name: "제주 유나이티드", shortName: "제주", logo: "🟠", stadium: "제주월드컵경기장", city: "제주" },
  { id: "gangwon", name: "강원 FC", shortName: "강원", logo: "🟤", stadium: "춘천송암스포츠타운", city: "춘천" },
  { id: "gimcheon", name: "김천 상무", shortName: "김천", logo: "⚪", stadium: "김천종합스포츠타운", city: "김천" },
  { id: "gwangju", name: "광주 FC", shortName: "광주", logo: "🟡", stadium: "광주축구전용구장", city: "광주" },
  { id: "suwonfc", name: "수원 FC", shortName: "수원FC", logo: "🔵", stadium: "수원종합운동장", city: "수원" },
];

export const matches: Match[] = [
  {
    id: "match-1", round: 12, homeTeam: "FC 서울", awayTeam: "수원 삼성",
    homeTeamId: "fcseoul", awayTeamId: "suwon",
    homeScore: 3, awayScore: 1, date: "2026-03-14", venue: "서울월드컵경기장",
    avgRating: 4.2, homeAvgRating: 4.5, awayAvgRating: 3.2, totalRatings: 1247, homeTeamLogo: "🔴", awayTeamLogo: "🔵", isFeatured: true,
  },
  {
    id: "match-2", round: 12, homeTeam: "전북 현대", awayTeam: "울산 HD",
    homeTeamId: "jeonbuk", awayTeamId: "ulsan",
    homeScore: 2, awayScore: 2, date: "2026-03-14", venue: "전주월드컵경기장",
    avgRating: 3.9, homeAvgRating: 3.8, awayAvgRating: 4.0, totalRatings: 983, homeTeamLogo: "🟢", awayTeamLogo: "🟠",
  },
  {
    id: "match-3", round: 12, homeTeam: "대구 FC", awayTeam: "인천 유나이티드",
    homeTeamId: "daegu", awayTeamId: "incheon",
    homeScore: 1, awayScore: 0, date: "2026-03-15", venue: "DGB대구은행파크",
    avgRating: 3.1, homeAvgRating: 3.4, awayAvgRating: 2.8, totalRatings: 412, homeTeamLogo: "🔵", awayTeamLogo: "🔷",
  },
  {
    id: "match-4", round: 12, homeTeam: "포항 스틸러스", awayTeam: "제주 유나이티드",
    homeTeamId: "pohang", awayTeamId: "jeju",
    homeScore: 4, awayScore: 2, date: "2026-03-15", venue: "포항스틸야드",
    avgRating: 4.0, homeAvgRating: 4.3, awayAvgRating: 3.1, totalRatings: 678, homeTeamLogo: "🔴", awayTeamLogo: "🟠",
  },
  {
    id: "match-5", round: 12, homeTeam: "강원 FC", awayTeam: "김천 상무",
    homeTeamId: "gangwon", awayTeamId: "gimcheon",
    homeScore: 0, awayScore: 1, date: "2026-03-15", venue: "춘천송암스포츠타운",
    avgRating: 2.7, homeAvgRating: 2.3, awayAvgRating: 3.1, totalRatings: 234, homeTeamLogo: "🟤", awayTeamLogo: "⚪",
  },
  {
    id: "match-6", round: 12, homeTeam: "광주 FC", awayTeam: "수원 FC",
    homeTeamId: "gwangju", awayTeamId: "suwonfc",
    homeScore: 2, awayScore: 1, date: "2026-03-15", venue: "광주축구전용구장",
    avgRating: 3.5, homeAvgRating: 3.8, awayAvgRating: 3.0, totalRatings: 345, homeTeamLogo: "🟡", awayTeamLogo: "🔵",
  },
  {
    id: "match-7", round: 11, homeTeam: "울산 HD", awayTeam: "FC 서울",
    homeTeamId: "ulsan", awayTeamId: "fcseoul",
    homeScore: 1, awayScore: 2, date: "2026-03-07", venue: "울산문수축구경기장",
    avgRating: 3.8, homeAvgRating: 3.2, awayAvgRating: 4.1, totalRatings: 890, homeTeamLogo: "🟠", awayTeamLogo: "🔴",
  },
  {
    id: "match-8", round: 11, homeTeam: "수원 삼성", awayTeam: "전북 현대",
    homeTeamId: "suwon", awayTeamId: "jeonbuk",
    homeScore: 0, awayScore: 3, date: "2026-03-07", venue: "수원월드컵경기장",
    avgRating: 3.2, homeAvgRating: 2.5, awayAvgRating: 4.2, totalRatings: 567, homeTeamLogo: "🔵", awayTeamLogo: "🟢",
  },
  {
    id: "match-9", round: 10, homeTeam: "FC 서울", awayTeam: "전북 현대",
    homeTeamId: "fcseoul", awayTeamId: "jeonbuk",
    homeScore: 1, awayScore: 1, date: "2026-02-28", venue: "서울월드컵경기장",
    avgRating: 3.6, homeAvgRating: 3.5, awayAvgRating: 3.7, totalRatings: 1102, homeTeamLogo: "🔴", awayTeamLogo: "🟢",
  },
  {
    id: "match-10", round: 13, homeTeam: "수원 삼성", awayTeam: "FC 서울",
    homeTeamId: "suwon", awayTeamId: "fcseoul",
    homeScore: 0, awayScore: 0, date: "2026-03-28", venue: "수원월드컵경기장",
    avgRating: 0, homeAvgRating: 0, awayAvgRating: 0, totalRatings: 0, homeTeamLogo: "🔵", awayTeamLogo: "🔴",
  },
  {
    id: "match-11", round: 13, homeTeam: "울산 HD", awayTeam: "전북 현대",
    homeTeamId: "ulsan", awayTeamId: "jeonbuk",
    homeScore: 0, awayScore: 0, date: "2026-03-28", venue: "울산문수축구경기장",
    avgRating: 0, homeAvgRating: 0, awayAvgRating: 0, totalRatings: 0, homeTeamLogo: "🟠", awayTeamLogo: "🟢",
  },
  {
    id: "match-12", round: 13, homeTeam: "인천 유나이티드", awayTeam: "대구 FC",
    homeTeamId: "incheon", awayTeamId: "daegu",
    homeScore: 0, awayScore: 0, date: "2026-03-29", venue: "인천축구전용경기장",
    avgRating: 0, homeAvgRating: 0, awayAvgRating: 0, totalRatings: 0, homeTeamLogo: "🔷", awayTeamLogo: "🔵",
  },
];

export const matchPlayers: Record<string, Player[]> = {
  "match-1": [
    { id: "p1", name: "Ki Sung-yueng", nameKr: "기성용", position: "MF", number: 6, avgRating: 4.6, totalRatings: 1180, teamId: "fcseoul" },
    { id: "p2", name: "Park Joo-ho", nameKr: "박주호", position: "DF", number: 3, avgRating: 3.8, totalRatings: 1102, teamId: "fcseoul" },
    { id: "p3", name: "Cho Young-wook", nameKr: "조영욱", position: "FW", number: 9, avgRating: 4.4, totalRatings: 1156, teamId: "fcseoul" },
    { id: "p4", name: "Yang Hyun-jun", nameKr: "양현준", position: "MF", number: 14, avgRating: 3.6, totalRatings: 1089, teamId: "fcseoul" },
    { id: "p5", name: "Kim Jin-su", nameKr: "김진수", position: "DF", number: 5, avgRating: 3.4, totalRatings: 1045, teamId: "fcseoul" },
    { id: "p6", name: "Lee Seung-woo", nameKr: "이승우", position: "FW", number: 7, avgRating: 2.6, totalRatings: 978, teamId: "fcseoul" },
    { id: "p7", name: "Go Yo-han", nameKr: "고요한", position: "DF", number: 2, avgRating: 3.7, totalRatings: 1021, teamId: "fcseoul" },
    { id: "p8", name: "Hwang In-beom", nameKr: "황인범", position: "MF", number: 8, avgRating: 4.1, totalRatings: 1134, teamId: "fcseoul" },
    { id: "p9", name: "Kim Young-gwon", nameKr: "김영권", position: "DF", number: 4, avgRating: 4.0, totalRatings: 1067, teamId: "fcseoul" },
    { id: "p10", name: "Bae Jun-ho", nameKr: "배준호", position: "MF", number: 10, avgRating: 3.3, totalRatings: 934, teamId: "fcseoul" },
    { id: "p11", name: "Song Bum-keun", nameKr: "송범근", position: "GK", number: 1, avgRating: 3.9, totalRatings: 1098, teamId: "fcseoul" },
    { id: "p12", name: "Lee Kang-in", nameKr: "이강인", position: "MF", number: 17, avgRating: 3.5, totalRatings: 456, isSubstitute: true, teamId: "fcseoul" },
    { id: "p13", name: "Jeong Woo-yeong", nameKr: "정우영", position: "FW", number: 18, avgRating: 3.2, totalRatings: 312, isSubstitute: true, teamId: "fcseoul" },
  ],
};

// All players across the league for the Players page
export const allPlayers: Player[] = [
  { id: "p1", name: "Ki Sung-yueng", nameKr: "기성용", position: "MF", number: 6, avgRating: 4.6, totalRatings: 1180, teamId: "fcseoul" },
  { id: "p3", name: "Cho Young-wook", nameKr: "조영욱", position: "FW", number: 9, avgRating: 4.4, totalRatings: 1156, teamId: "fcseoul" },
  { id: "p8", name: "Hwang In-beom", nameKr: "황인범", position: "MF", number: 8, avgRating: 4.1, totalRatings: 1134, teamId: "fcseoul" },
  { id: "p9", name: "Kim Young-gwon", nameKr: "김영권", position: "DF", number: 4, avgRating: 4.0, totalRatings: 1067, teamId: "fcseoul" },
  { id: "p11", name: "Song Bum-keun", nameKr: "송범근", position: "GK", number: 1, avgRating: 3.9, totalRatings: 1098, teamId: "fcseoul" },
  { id: "p2", name: "Park Joo-ho", nameKr: "박주호", position: "DF", number: 3, avgRating: 3.8, totalRatings: 1102, teamId: "fcseoul" },
  { id: "p14", name: "Kim Do-young", nameKr: "김도영", position: "MF", number: 10, avgRating: 4.3, totalRatings: 987, teamId: "jeonbuk" },
  { id: "p15", name: "Stanislav Iljutcenko", nameKr: "일류첸코", position: "FW", number: 9, avgRating: 4.5, totalRatings: 1045, teamId: "jeonbuk" },
  { id: "p16", name: "Hong Jeong-ho", nameKr: "홍정호", position: "DF", number: 4, avgRating: 3.7, totalRatings: 890, teamId: "jeonbuk" },
  { id: "p17", name: "Oh Se-hun", nameKr: "오세훈", position: "FW", number: 11, avgRating: 4.2, totalRatings: 1023, teamId: "ulsan" },
  { id: "p18", name: "Um Won-sang", nameKr: "엄원상", position: "MF", number: 7, avgRating: 3.9, totalRatings: 876, teamId: "ulsan" },
  { id: "p19", name: "Kim Tae-hwan", nameKr: "김태환", position: "DF", number: 2, avgRating: 3.6, totalRatings: 945, teamId: "ulsan" },
  { id: "p20", name: "Cesinha", nameKr: "세징야", position: "FW", number: 10, avgRating: 4.1, totalRatings: 912, teamId: "daegu" },
  { id: "p21", name: "Mugosa", nameKr: "무고사", position: "FW", number: 9, avgRating: 3.8, totalRatings: 834, teamId: "incheon" },
  { id: "p22", name: "Shin Jin-ho", nameKr: "신진호", position: "MF", number: 8, avgRating: 3.5, totalRatings: 756, teamId: "pohang" },
  { id: "p23", name: "Joo Min-gyu", nameKr: "주민규", position: "FW", number: 19, avgRating: 4.0, totalRatings: 801, teamId: "jeju" },
];

// Per-player match-by-match ratings
export const playerMatchRatings: Record<string, { matchId: string; rating: number; date: string; opponent: string }[]> = {
  p1: [
    { matchId: "match-9", rating: 4.2, date: "2026-02-28", opponent: "전북 현대" },
    { matchId: "match-7", rating: 4.5, date: "2026-03-07", opponent: "울산 HD" },
    { matchId: "match-1", rating: 4.6, date: "2026-03-14", opponent: "수원 삼성" },
  ],
  p3: [
    { matchId: "match-9", rating: 3.8, date: "2026-02-28", opponent: "전북 현대" },
    { matchId: "match-7", rating: 4.1, date: "2026-03-07", opponent: "울산 HD" },
    { matchId: "match-1", rating: 4.4, date: "2026-03-14", opponent: "수원 삼성" },
  ],
  p8: [
    { matchId: "match-9", rating: 3.9, date: "2026-02-28", opponent: "전북 현대" },
    { matchId: "match-7", rating: 4.0, date: "2026-03-07", opponent: "울산 HD" },
    { matchId: "match-1", rating: 4.1, date: "2026-03-14", opponent: "수원 삼성" },
  ],
  p15: [
    { matchId: "match-8", rating: 4.7, date: "2026-03-07", opponent: "수원 삼성" },
    { matchId: "match-9", rating: 4.3, date: "2026-02-28", opponent: "FC 서울" },
  ],
  p17: [
    { matchId: "match-7", rating: 3.5, date: "2026-03-07", opponent: "FC 서울" },
    { matchId: "match-2", rating: 4.2, date: "2026-03-14", opponent: "전북 현대" },
  ],
};

// Player review with match context
export interface PlayerReview extends Review {
  matchId: string;
  matchLabel: string;
}

// Player reviews per player ID
export const playerReviews: Record<string, PlayerReview[]> = {
  p1: [
    { id: "pr1", author: "미드필더덕후", rating: 4.5, text: "경기 템포 조절이 예술이었다. 역시 기성용.", likes: 89, createdAt: "2026-03-14T19:00:00", matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
    { id: "pr2", author: "서울팬_준호", rating: 5, text: "이 경기 MVP. 패스 성공률 미쳤음", likes: 124, createdAt: "2026-03-14T18:45:00", isModified: true, matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
    { id: "pr3", author: "K리그초보", rating: 4, text: "후반 좀 지쳤지만 전반전은 완벽", likes: 34, createdAt: "2026-03-14T20:10:00", matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
  ],
  p3: [
    { id: "pr4", author: "골잡이_팬", rating: 5, text: "해트트릭!! 레전드 경기 ⚽⚽⚽", likes: 201, createdAt: "2026-03-14T18:30:00", matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
    { id: "pr5", author: "수원팬_슬픔", rating: 4, text: "인정할 건 인정. 조영욱 오늘 미쳤다", likes: 67, createdAt: "2026-03-14T19:20:00", matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
  ],
  p2: [
    { id: "pr6", author: "수비평론가", rating: 3.5, text: "무난한 경기. 큰 실수 없었음", likes: 22, createdAt: "2026-03-14T19:30:00", matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
  ],
  p8: [
    { id: "pr7", author: "황인범_응원단", rating: 4.5, text: "기성용이랑 호흡 찰떡. 볼 배급 좋았다", likes: 78, createdAt: "2026-03-14T18:50:00", matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
    { id: "pr8", author: "전술분석가", rating: 4, text: "수비 가담도 적극적이었고, 전환 플레이 빨랐음", likes: 45, createdAt: "2026-03-14T19:15:00", matchId: "match-1", matchLabel: "FC 서울 vs 수원 삼성 (R12)" },
  ],
};

export const matchReviews: Record<string, Review[]> = {
  "match-1": [
    {
      id: "r1", author: "축구전술가_K", rating: 4.5,
      text: "기성용의 딥라잉 플레이메이킹과 사이드 전환은 완벽했다. 오늘 K리그 역대급 경기 중 하나.",
      likes: 342, createdAt: "2026-03-14T18:30:00",
    },
    {
      id: "r2", author: "서울_Forever", rating: 5,
      text: "슈퍼매치 역대 최고의 경기! 조영욱의 해트트릭은 잊을 수 없을 것. 경기장 분위기도 미쳤다 🔥",
      likes: 287, createdAt: "2026-03-14T18:15:00", isModified: true,
    },
    {
      id: "r3", author: "K리그_분석왕", rating: 4,
      text: "전반전 수원의 압박이 인상적이었지만, 후반 서울의 전술 변경이 결정적이었다. 황인범-기성용 미드필드 듀오가 경기를 지배.",
      likes: 198, createdAt: "2026-03-14T19:00:00",
    },
    {
      id: "r4", author: "캐주얼팬_민수", rating: 3.5,
      text: "친구 따라 처음 경기장 갔는데 너무 재밌었어요! K리그 이렇게 재밌는 줄 몰랐음",
      likes: 156, createdAt: "2026-03-14T20:30:00",
    },
  ],
};
