export const orders: {
  id: string
  customer: string
  type: "Rent" | "Tailor"
  item: string
  amount: string
  status:
    | "Ongoing"
    | "Returned"
    | "Processing"
    | "Overdue"
    | "Pending_Measurement"
  dateRange?: string
  progress?: number
  deadline: string
}[] = [
  {
    id: "ORD-5501",
    customer: "Lê Hải Yến",
    type: "Rent",
    item: "Kimono Furisode Red Sakura",
    amount: "850.000đ",
    status: "Ongoing",
    dateRange: "12/05 - 15/05",
    deadline: "Còn 2 ngày",
  },
  {
    id: "ORD-7720",
    customer: "Nguyễn Đình Phúc",
    type: "Tailor",
    item: "Giáp Genshin Impact - Itto",
    amount: "12.500.000đ",
    status: "Processing",
    progress: 65,
    deadline: "Trả 20/06",
  },
  {
    id: "ORD-2231",
    customer: "Trần Minh Anh",
    type: "Rent",
    item: "Váy Lolita Blue Alice",
    amount: "450.000đ",
    status: "Returned",
    dateRange: "01/05 - 03/05",
    deadline: "Hoàn tất",
  },
  {
    id: "ORD-8842",
    customer: "Hoàng Thùy Chi",
    type: "Tailor",
    item: "Đầm Gothic",
    amount: "4.200.000đ",
    status: "Pending_Measurement",
    progress: 10,
    deadline: "Gấp",
  },
  {
    id: "ORD-1109",
    customer: "Phạm Bảo Nam",
    type: "Rent",
    item: "Cosplay Samurai Armor",
    amount: "1.200.000đ",
    status: "Overdue",
    dateRange: "05/05 - 08/05",
    deadline: "Trễ 2 ngày",
  },
]
