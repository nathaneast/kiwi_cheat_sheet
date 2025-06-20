import React from 'react';
import { MapPin, Briefcase, Home, Users } from 'lucide-react';
import { Category } from '../types';

export const categories: Category[] = [
  {
    id: "regions",
    name: "지역 정보",
    icon: <MapPin className="w-6 h-6" />,
    subcategories: [
      { id: "auckland", name: "오클랜드" },
      { id: "wellington", name: "웰링턴" },
      { id: "christchurch", name: "크라이스트처치" },
      { id: "queenstown", name: "퀸스타운" },
      { id: "rotorua-tauranga", name: "로토루아 & 타우랑가" },
      { id: "taupo", name: "타우포" },
      { id: "napier-hastings", name: "네이피어 & 헤이스팅스" },
      { id: "marlborough-blenheim", name: "말버러 & 블레넘" },
      { id: "palmerston-north", name: "파머스턴 노스" },
      { id: "nelson", name: "넬슨" },
    ],
  },
  {
    id: "living",
    name: "생활 정보",
    icon: <Home className="w-6 h-6" />,
    subcategories: [
      { id: "usedcar", name: "중고차" },
      { id: "tax", name: "세금/IRD" },
      { id: "banking", name: "은행" },
      { id: "accommodation", name: "숙소" },
      { id: "transportation", name: "교통" },
      { id: "visa", name: "비자" },
      { id: "phone", name: "휴대폰" },
      { id: "shopping", name: "쇼핑" },
      { id: "healthcare", name: "의료" },
      { id: "insurance", name: "보험" },
      { id: "travel-leisure", name: "여행/여가" },
    ],
  },
  {
    id: "farm-factory",
    name: "시즌잡(농장/공장)",
    icon: <Briefcase className="w-6 h-6" />,
    subcategories: [
      { id: "kiwi", name: "키위" },
      { id: "apple", name: "사과" },
      { id: "blueberry", name: "블루베리" },
      { id: "cherry", name: "체리" },
      { id: "nectarine-apricot", name: "천도복숭아/살구" },
      { id: "grape-vineyard", name: "포도/빈야드" },
      { id: "mussel", name: "홍합" },
      { id: "fish", name: "생선" },
      { id: "frozen-vegetable", name: "냉동야채" },
      { id: "meat-factory", name: "고기공장" },
      { id: "ham-bacon", name: "햄/베이컨" },
    ],
  },
  {
    id: "city-job",
    name: "시티잡",
    icon: <Users className="w-6 h-6" />,
    subcategories: [
      { id: "cafe", name: "카페" },
      { id: "restaurant", name: "식당" },
      { id: "mart-shop", name: "마트/상점" },
    ],
  },
  {
    id: "before-entering",
    name: "입국 전",
    icon: <Users className="w-6 h-6" />,
    subcategories: [
      { id: "luggage", name: "짐싸기" },
      { id: "flight", name: "항공편" },
      { id: "tips", name: "꿀팁" },
    ],
  },
];