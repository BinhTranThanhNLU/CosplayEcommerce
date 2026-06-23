import { MapPin } from "lucide-react";
import type { VietnamProvince } from "../../data/vietnamAddress";

interface AddressSectionProps {
  recipientName: string;
  setRecipientName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  provinceCode: string;
  handleProvinceChange: (val: string) => void;
  districtCode: string;
  handleDistrictChange: (val: string) => void;
  wardCode: string;
  setWardCode: (val: string) => void;
  detailAddress: string;
  setDetailAddress: (val: string) => void;
  addressData: VietnamProvince[];
  isAddressLoading: boolean;
  districts: { code: string | number; name: string; wards?: any[] }[];
  wards: { code: string | number; name: string }[];
}

export const AddressSection = (props: AddressSectionProps) => {
  const {
    recipientName,
    setRecipientName,
    phoneNumber,
    setPhoneNumber,
    provinceCode,
    handleProvinceChange,
    districtCode,
    handleDistrictChange,
    wardCode,
    setWardCode,
    detailAddress,
    setDetailAddress,
    addressData,
    isAddressLoading,
    districts,
    wards,
  } = props;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
        <MapPin className="h-6 w-6 text-[#ee4d2d]" />
        <div>
          <h2 className="text-lg font-bold text-[#222]">Địa chỉ nhận hàng</h2>
          <p className="text-sm text-[#777]">
            Thông tin này sẽ được lưu vào địa chỉ giao hàng của đơn.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-[#333]">
          Họ tên người nhận <span className="text-[#ee4d2d]">*</span>
          <input
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#e8e8e8] px-4 outline-none focus:border-[#ee4d2d]"
            placeholder="Nguyễn Văn A"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#333]">
          Số điện thoại Việt Nam <span className="text-[#ee4d2d]">*</span>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#e8e8e8] px-4 outline-none focus:border-[#ee4d2d]"
            placeholder="0901234567"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm font-medium text-[#333]">
          Tỉnh / Thành phố <span className="text-[#ee4d2d]">*</span>
          <select
            value={provinceCode}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#e8e8e8] bg-white px-4 outline-none focus:border-[#ee4d2d]"
            disabled={isAddressLoading}
          >
            <option value="">
              {isAddressLoading
                ? "Đang tải tỉnh/thành..."
                : "Chọn tỉnh/thành phố"}
            </option>
            {addressData.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[#333]">
          Quận / Huyện <span className="text-[#ee4d2d]">*</span>
          <select
            value={districtCode}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#e8e8e8] bg-white px-4 outline-none focus:border-[#ee4d2d] disabled:bg-[#f7f7f7]"
            disabled={!provinceCode}
          >
            <option value="">
              {provinceCode ? "Chọn quận/huyện" : "Chọn tỉnh/thành trước"}
            </option>
            {districts.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[#333]">
          Phường / Xã <span className="text-[#ee4d2d]">*</span>
          <select
            value={wardCode}
            onChange={(e) => setWardCode(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#e8e8e8] bg-white px-4 outline-none focus:border-[#ee4d2d] disabled:bg-[#f7f7f7]"
            disabled={!districtCode}
          >
            <option value="">
              {districtCode ? "Chọn phường/xã" : "Chọn quận/huyện trước"}
            </option>
            {wards.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block space-y-2 text-sm font-medium text-[#333]">
        Địa chỉ chi tiết <span className="text-[#ee4d2d]">*</span>
        <textarea
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-[#e8e8e8] px-4 py-3 outline-none focus:border-[#ee4d2d]"
          placeholder="Số nhà, tên đường, hẻm/tòa nhà/tầng/phòng. Ví dụ: 12 Nguyễn Huệ, hẻm 3, tầng 2"
        />
      </label>
    </section>
  );
};
