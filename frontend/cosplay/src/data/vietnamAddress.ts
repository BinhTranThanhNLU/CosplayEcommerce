export type VietnamWard = {
  code: number;
  name: string;
};

export type VietnamDistrict = {
  code: number;
  name: string;
  wards: VietnamWard[];
};

export type VietnamProvince = {
  code: number;
  name: string;
  districts: VietnamDistrict[];
};

const fallbackVietnamAddressData: VietnamProvince[] = [
  {
    code: 1,
    name: "Thành phố Hà Nội",
    districts: [
      {
        code: 1,
        name: "Quận Ba Đình",
        wards: [
          { code: 1, name: "Phường Phúc Xá" },
          { code: 4, name: "Phường Trúc Bạch" },
          { code: 6, name: "Phường Vĩnh Phúc" },
          { code: 8, name: "Phường Cống Vị" },
          { code: 10, name: "Phường Liễu Giai" },
          { code: 13, name: "Phường Nguyễn Trung Trực" },
          { code: 16, name: "Phường Quán Thánh" },
          { code: 19, name: "Phường Ngọc Hà" },
          { code: 22, name: "Phường Điện Biên" },
          { code: 25, name: "Phường Đội Cấn" },
          { code: 28, name: "Phường Ngọc Khánh" },
          { code: 31, name: "Phường Kim Mã" },
          { code: 34, name: "Phường Giảng Võ" },
          { code: 37, name: "Phường Thành Công" },
        ],
      },
      {
        code: 2,
        name: "Quận Hoàn Kiếm",
        wards: [
          { code: 40, name: "Phường Phúc Tân" },
          { code: 43, name: "Phường Đồng Xuân" },
          { code: 46, name: "Phường Hàng Mã" },
          { code: 49, name: "Phường Hàng Buồm" },
          { code: 52, name: "Phường Hàng Đào" },
          { code: 55, name: "Phường Hàng Bồ" },
          { code: 58, name: "Phường Cửa Đông" },
          { code: 61, name: "Phường Lý Thái Tổ" },
          { code: 64, name: "Phường Hàng Bạc" },
          { code: 67, name: "Phường Hàng Gai" },
          { code: 70, name: "Phường Chương Dương" },
          { code: 73, name: "Phường Hàng Trống" },
          { code: 76, name: "Phường Cửa Nam" },
          { code: 79, name: "Phường Hàng Bông" },
          { code: 82, name: "Phường Tràng Tiền" },
          { code: 85, name: "Phường Trần Hưng Đạo" },
          { code: 88, name: "Phường Phan Chu Trinh" },
          { code: 91, name: "Phường Hàng Bài" },
        ],
      },
      {
        code: 760,
        name: "Quận Cầu Giấy",
        wards: [
          { code: 26734, name: "Phường Nghĩa Đô" },
          { code: 26737, name: "Phường Nghĩa Tân" },
          { code: 26740, name: "Phường Mai Dịch" },
          { code: 26743, name: "Phường Dịch Vọng" },
          { code: 26746, name: "Phường Dịch Vọng Hậu" },
          { code: 26749, name: "Phường Quan Hoa" },
          { code: 26752, name: "Phường Yên Hoà" },
          { code: 26755, name: "Phường Trung Hoà" },
        ],
      },
    ],
  },
  {
    code: 79,
    name: "Thành phố Hồ Chí Minh",
    districts: [
      {
        code: 760,
        name: "Quận 1",
        wards: [
          { code: 26734, name: "Phường Tân Định" },
          { code: 26737, name: "Phường Đa Kao" },
          { code: 26740, name: "Phường Bến Nghé" },
          { code: 26743, name: "Phường Bến Thành" },
          { code: 26746, name: "Phường Nguyễn Thái Bình" },
          { code: 26749, name: "Phường Phạm Ngũ Lão" },
          { code: 26752, name: "Phường Cầu Ông Lãnh" },
          { code: 26755, name: "Phường Cô Giang" },
          { code: 26758, name: "Phường Nguyễn Cư Trinh" },
          { code: 26761, name: "Phường Cầu Kho" },
        ],
      },
      {
        code: 769,
        name: "Quận 7",
        wards: [
          { code: 27478, name: "Phường Tân Thuận Đông" },
          { code: 27481, name: "Phường Tân Thuận Tây" },
          { code: 27484, name: "Phường Tân Kiểng" },
          { code: 27487, name: "Phường Tân Hưng" },
          { code: 27490, name: "Phường Bình Thuận" },
          { code: 27493, name: "Phường Tân Quy" },
          { code: 27496, name: "Phường Phú Thuận" },
          { code: 27499, name: "Phường Tân Phú" },
          { code: 27502, name: "Phường Tân Phong" },
          { code: 27505, name: "Phường Phú Mỹ" },
        ],
      },
      {
        code: 770,
        name: "Thành phố Thủ Đức",
        wards: [
          { code: 26800, name: "Phường Linh Xuân" },
          { code: 26803, name: "Phường Bình Chiểu" },
          { code: 26806, name: "Phường Linh Trung" },
          { code: 26809, name: "Phường Tam Bình" },
          { code: 26812, name: "Phường Tam Phú" },
          { code: 26815, name: "Phường Hiệp Bình Phước" },
          { code: 26818, name: "Phường Hiệp Bình Chánh" },
          { code: 26821, name: "Phường Linh Chiểu" },
          { code: 26824, name: "Phường Linh Tây" },
          { code: 26827, name: "Phường Linh Đông" },
          { code: 26830, name: "Phường Bình Thọ" },
          { code: 26833, name: "Phường Trường Thọ" },
        ],
      },
    ],
  },
  {
    code: 48,
    name: "Thành phố Đà Nẵng",
    districts: [
      {
        code: 490,
        name: "Quận Hải Châu",
        wards: [
          { code: 20194, name: "Phường Thanh Bình" },
          { code: 20195, name: "Phường Thuận Phước" },
          { code: 20197, name: "Phường Thạch Thang" },
          { code: 20200, name: "Phường Hải Châu I" },
          { code: 20203, name: "Phường Hải Châu II" },
          { code: 20206, name: "Phường Phước Ninh" },
          { code: 20207, name: "Phường Hoà Thuận Tây" },
          { code: 20209, name: "Phường Hoà Thuận Đông" },
          { code: 20212, name: "Phường Nam Dương" },
          { code: 20215, name: "Phường Bình Hiên" },
          { code: 20218, name: "Phường Bình Thuận" },
          { code: 20221, name: "Phường Hoà Cường Bắc" },
          { code: 20224, name: "Phường Hoà Cường Nam" },
        ],
      },
      {
        code: 491,
        name: "Quận Thanh Khê",
        wards: [
          { code: 20227, name: "Phường Tam Thuận" },
          { code: 20230, name: "Phường Thanh Khê Tây" },
          { code: 20233, name: "Phường Thanh Khê Đông" },
          { code: 20236, name: "Phường Xuân Hà" },
          { code: 20239, name: "Phường Tân Chính" },
          { code: 20242, name: "Phường Chính Gián" },
          { code: 20245, name: "Phường Vĩnh Trung" },
          { code: 20246, name: "Phường Thạc Gián" },
          { code: 20248, name: "Phường An Khê" },
          { code: 20251, name: "Phường Hoà Khê" },
        ],
      },
    ],
  },
  {
    code: 92,
    name: "Thành phố Cần Thơ",
    districts: [
      {
        code: 916,
        name: "Quận Ninh Kiều",
        wards: [
          { code: 31117, name: "Phường Cái Khế" },
          { code: 31120, name: "Phường An Hòa" },
          { code: 31123, name: "Phường Thới Bình" },
          { code: 31126, name: "Phường An Nghiệp" },
          { code: 31129, name: "Phường An Cư" },
          { code: 31135, name: "Phường Tân An" },
          { code: 31141, name: "Phường An Phú" },
          { code: 31144, name: "Phường Xuân Khánh" },
          { code: 31147, name: "Phường Hưng Lợi" },
          { code: 31150, name: "Phường An Khánh" },
          { code: 31153, name: "Phường An Bình" },
        ],
      },
    ],
  },
  {
    code: 31,
    name: "Thành phố Hải Phòng",
    districts: [
      {
        code: 303,
        name: "Quận Hồng Bàng",
        wards: [
          { code: 11383, name: "Phường Quán Toan" },
          { code: 11386, name: "Phường Hùng Vương" },
          { code: 11389, name: "Phường Sở Dầu" },
          { code: 11392, name: "Phường Thượng Lý" },
          { code: 11395, name: "Phường Hạ Lý" },
          { code: 11398, name: "Phường Minh Khai" },
          { code: 11401, name: "Phường Trại Chuối" },
          { code: 11404, name: "Phường Hoàng Văn Thụ" },
          { code: 11407, name: "Phường Phan Bội Châu" },
        ],
      },
    ],
  },
];

export const getFallbackVietnamAddressData = () => fallbackVietnamAddressData;

const normalizeApiData = (data: any[]): VietnamProvince[] =>
  data.map((province) => ({
    code: Number(province.code),
    name: String(province.name),
    districts: (province.districts ?? []).map((district: any) => ({
      code: Number(district.code),
      name: String(district.name),
      wards: (district.wards ?? []).map((ward: any) => ({
        code: Number(ward.code),
        name: String(ward.name),
      })),
    })),
  }));

export const loadVietnamAddressData = async (): Promise<VietnamProvince[]> => {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
    if (!response.ok) throw new Error("Can not load Vietnam address data");
    const data = await response.json();
    return normalizeApiData(data);
  } catch (error) {
    console.warn("Không thể tải dữ liệu địa chỉ Việt Nam từ API, dùng dữ liệu dự phòng.", error);
    return fallbackVietnamAddressData;
  }
};
