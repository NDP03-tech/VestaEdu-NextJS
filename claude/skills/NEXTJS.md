# Hướng dẫn chuyển từ React sang Next.js (giữ nguyên component & giao diện)

Nguyên tắc chung: **không viết lại UI**, chỉ thay đổi phần routing và cách khai báo client/server. Làm ở project mới song song để dễ so sánh, tránh sửa trực tiếp lên code cũ.

## Bước 1 — Kiểm tra và dọn dẹp dự án React hiện tại

Liệt kê các thư viện đang dùng: `react-router-dom`, redux/zustand, axios, css/scss/tailwind, thư viện UI (MUI, antd...). Ghi chú những chỗ dùng `window`, `document`, `localStorage`, hoặc các API chỉ có ở trình duyệt — đây là những điểm dễ vỡ khi chuyển sang Next.js (do Next render ở server trước).

## Bước 2 — Khởi tạo dự án Next.js mới song song

Tạo project Next.js mới bằng `npx create-next-app@latest`. Chọn **App Router** hoặc **Pages Router** tùy bạn quen cái nào hơn — Pages Router dễ chuyển từ React truyền thống hơn vì logic gần giống SPA cũ. Đừng sửa trực tiếp lên code cũ, làm ở project mới để dễ so sánh và rollback.

## Bước 3 — Copy nguyên component và style sang, chưa sửa gì

Copy thư mục `components`, `assets`, `styles`, `hooks`, `utils` gần như nguyên vẹn vào project Next.js (thường đặt trong `src/components`, `src/styles`...). Copy luôn file cấu hình Tailwind/SCSS nếu có. Mục tiêu là giữ UI y hệt, chưa cần chạy được ngay.

## Bước 4 — Chuyển đổi phần routing

- **App Router:** mỗi route cũ (ví dụ `/about`) trở thành file `app/about/page.jsx` chứa component tương ứng.
- **Pages Router:** đưa vào `pages/about.jsx`.

Thay `<Link>` của `react-router-dom` bằng `next/link`, thay `useNavigate`/`useHistory` bằng `useRouter` từ `next/navigation` (App Router) hoặc `next/router` (Pages Router).

## Bước 5 — Đánh dấu `'use client'` cho các component tương tác

Nếu dùng App Router (mặc định là server component), những component có dùng `useState`, `useEffect`, `onClick`, hoặc thư viện chỉ chạy client (charts, map, editor...) cần thêm dòng `'use client'` ở đầu file. Đây là bước hay gây lỗi nhất khi migrate nên làm cẩn thận từng file một.

## Bước 6 — Chuyển đổi biến môi trường và file cấu hình

Đổi tiền tố biến môi trường từ `REACT_APP_` (hoặc `VITE_`) sang `NEXT_PUBLIC_` nếu cần dùng ở client. Copy file `.env` sang và đổi tên biến tương ứng. Kiểm tra lại cấu hình proxy/base URL cho API nếu trước đây dùng trong `package.json` hoặc `vite.config`.

## Bước 7 — Kiểm tra lại phần gọi API và data fetching

Nếu trước đây fetch API bằng `useEffect` + axios trong component, bạn có thể giữ nguyên cách này (chạy client-side) để đơn giản, không bắt buộc phải chuyển ngay sang server component hay Next API routes. Sau này khi ổn định mới cân nhắc tối ưu SSR/SSG nếu cần SEO hoặc tốc độ tải.

## Bước 8 — Chạy thử và fix lỗi từng route, sau đó deploy

Chạy `npm run dev`, test từng trang một, ưu tiên sửa lỗi liên quan đến `window`/`document` không tồn tại (dùng `useEffect` hoặc kiểm tra `typeof window !== 'undefined'`), lỗi import ảnh (Next dùng `next/image` có cú pháp khác `<img>` thường). Khi toàn bộ chạy ổn thì mới deploy lên Vercel hoặc host khác.

---

## Lưu ý thêm

- **Không cần đổi UI/component gì cả** — component React thuần (JSX + hooks + CSS) chạy được y nguyên trong Next.js, vì Next.js về bản chất vẫn là React. Cái cần đổi chỉ là _routing_ và _cách khai báo client/server_.
- **Chọn Pages Router nếu muốn nhanh, ít rủi ro** — gần với SPA cũ nhất. App Router mạnh hơn (server component, layout lồng nhau...) nhưng có đường cong học tập, nên nếu dự án đã chạy ổn và không cần tính năng mới thì Pages Router an toàn hơn.
- **Ảnh và font:** nếu dùng thẻ `<img>` thường thì vẫn chạy được, không bắt buộc đổi sang `next/image` ngay — có thể để sau khi mọi thứ đã ổn định.
- **Nếu đang dùng CRA:** cân nhắc bỏ luôn CRA đi vì nó không còn được maintain, đây cũng là dịp tốt để chuyển hẳn.
