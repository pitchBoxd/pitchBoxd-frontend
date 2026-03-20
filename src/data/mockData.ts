export interface Player {
  id: string;
  name: string;
  nameKr: string;
  position: string;
  number: number;
  avgRating: number;
  totalRatings: number;
  isSubstitute?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  likes: number;
  createdAt: string;
}

export interface Match {
  id: string;
  round: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  venue: string;
  avgRating: number;
  totalRatings: number;
  homeTeamLogo: string;
  awayTeamLogo: string;
  isFeatured?: boolean;
}

export const matches: Match[] = [
  {
    id: "match-1",
    round: 12,
    homeTeam: "FC 서울",
    awayTeam: "수원 삼성",
    homeScore: 3,
    awayScore: 1,
    date: "2026-03-14",
    venue: "서울월드컵경기장",
    avgRating: 8.4,
    totalRatings: 1247,
    homeTeamLogo: "⚽",
    awayTeamLogo: "⚽",
    isFeatured: true,
  },
  {
    id: "match-2",
    round: 12,
    homeTeam: "전북 현대",
    awayTeam: "울산 HD",
    homeScore: 2,
    awayScore: 2,
    date: "2026-03-14",
    venue: "전주월드컵경기장",
    avgRating: 7.8,
    totalRatings: 983,
    homeTeamLogo: "⚽",
    awayTeamLogo: "⚽",
  },
  {
    id: "match-3",
    round: 12,
    homeTeam: "대구 FC",
    awayTeam: "인천 유나이티드",
    homeScore: 1,
    awayScore: 0,
    date: "2026-03-15",
    venue: "DGB대구은행파크",
    avgRating: 6.2,
    totalRatings: 412,
    homeTeamLogo: "⚽",
    awayTeamLogo: "⚽",
  },
  {
    id: "match-4",
    round: 12,
    homeTeam: "포항 스틸러스",
    awayTeam: "제주 유나이티드",
    homeScore: 4,
    awayScore: 2,
    date: "2026-03-15",
    venue: "포항스틸야드",
    avgRating: 8.1,
    totalRatings: 678,
    homeTeamLogo: "⚽",
    awayTeamLogo: "⚽",
  },
  {
    id: "match-5",
    round: 12,
    homeTeam: "강원 FC",
    awayTeam: "김천 상무",
    homeScore: 0,
    awayScore: 1,
    date: "2026-03-15",
    venue: "춘천송암스포츠타운",
    avgRating: 5.4,
    totalRatings: 234,
    homeTeamLogo: "⚽",
    awayTeamLogo: "⚽",
  },
  {
    id: "match-6",
    round: 12,
    homeTeam: "광주 FC",
    awayTeam: "수원 FC",
    homeScore: 2,
    awayScore: 1,
    date: "2026-03-15",
    venue: "광주축구전용구장",
    avgRating: 6.9,
    totalRatings: 345,
    homeTeamLogo: "⚽",
    awayTeamLogo: "⚽",
  },
];

export const matchPlayers: Record<string, Player[]> = {
  "match-1": [
    { id: "p1", name: "Ki Sung-yueng", nameKr: "기성용", position: "MF", number: 6, avgRating: 9.2, totalRatings: 1180 },
    { id: "p2", name: "Park Joo-ho", nameKr: "박주호", position: "DF", number: 3, avgRating: 7.5, totalRatings: 1102 },
    { id: "p3", name: "Cho Young-wook", nameKr: "조영욱", position: "FW", number: 9, avgRating: 8.8, totalRatings: 1156 },
    { id: "p4", name: "Yang Hyun-jun", nameKr: "양현준", position: "MF", number: 14, avgRating: 7.1, totalRatings: 1089 },
    { id: "p5", name: "Kim Jin-su", nameKr: "김진수", position: "DF", number: 5, avgRating: 6.8, totalRatings: 1045 },
    { id: "p6", name: "Lee Seung-woo", nameKr: "이승우", position: "FW", number: 7, avgRating: 5.2, totalRatings: 978 },
    { id: "p7", name: "Go Yo-han", nameKr: "고요한", position: "DF", number: 2, avgRating: 7.3, totalRatings: 1021 },
    { id: "p8", name: "Hwang In-beom", nameKr: "황인범", position: "MF", number: 8, avgRating: 8.1, totalRatings: 1134 },
    { id: "p9", name: "Kim Young-gwon", nameKr: "김영권", position: "DF", number: 4, avgRating: 7.9, totalRatings: 1067 },
    { id: "p10", name: "Bae Jun-ho", nameKr: "배준호", position: "MF", number: 10, avgRating: 6.5, totalRatings: 934 },
    { id: "p11", name: "Song Bum-keun", nameKr: "송범근", position: "GK", number: 1, avgRating: 7.7, totalRatings: 1098 },
    { id: "p12", name: "Lee Kang-in", nameKr: "이강인", position: "MF", number: 17, avgRating: 7.0, totalRatings: 456, isSubstitute: true },
    { id: "p13", name: "Jeong Woo-yeong", nameKr: "정우영", position: "FW", number: 18, avgRating: 6.3, totalRatings: 312, isSubstitute: true },
  ],
};

export const matchReviews: Record<string, Review[]> = {
  "match-1": [
    {
      id: "r1",
      author: "축구전술가_K",
      rating: 9,
      text: "기성용의 딥라잉 플레이메이킹과 사이드 전환은 완벽했다. 오늘 K리그 역대급 경기 중 하나.",
      likes: 342,
      createdAt: "2026-03-14T18:30:00",
    },
    {
      id: "r2",
      author: "서울_Forever",
      rating: 10,
      text: "슈퍼매치 역대 최고의 경기! 조영욱의 해트트릭은 잊을 수 없을 것. 경기장 분위기도 미쳤다 🔥",
      likes: 287,
      createdAt: "2026-03-14T18:15:00",
    },
    {
      id: "r3",
      author: "K리그_분석왕",
      rating: 8,
      text: "전반전 수원의 압박이 인상적이었지만, 후반 서울의 전술 변경이 결정적이었다. 황인범-기성용 미드필드 듀오가 경기를 지배.",
      likes: 198,
      createdAt: "2026-03-14T19:00:00",
    },
    {
      id: "r4",
      author: "캐주얼팬_민수",
      rating: 7,
      text: "친구 따라 처음 경기장 갔는데 너무 재밌었어요! K리그 이렇게 재밌는 줄 몰랐음",
      likes: 156,
      createdAt: "2026-03-14T20:30:00",
    },
  ],
};
