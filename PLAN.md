# 📋 Kế hoạch project: Bewerbungs-Tracker

> **Cách dùng file này**
> - Đây là **khung** – những chỗ có ✏️ là phần bạn tự thiết kế và điền vào.
> - Những chỗ ghi *Ví dụ* chỉ để gợi ý – bạn có thể sửa hoặc xóa.
> - Đánh dấu việc đã xong bằng cách đổi `- [ ]` thành `- [x]`.
> - Cập nhật file này trong suốt project – nó sẽ là "nhật ký" giúp bạn trả lời câu hỏi phỏng vấn.

**Bắt đầu:** 24.09.2026 **Mục tiêu hoàn thành MVP:** 10 giờ làm việc **Thời gian/tuần:** ✏️ ____ giờ

---

## 1. Tổng quan

| Mục | Nội dung |
|---|---|
| Tên project | Bewerbungstracker|
| Vấn đề cần giải quyết | ✏️ *(Gợi ý: theo dõi hồ sơ trong Excel bất tiện ở điểm nào?)* |
| Người dùng | nur ich|
| Mục tiêu học tập |  Vue 3 Composition API, TypeScript, Pinia, REST API, Testing|
| Mục tiêu cho CV | ✏️ *(Ví dụ: có link GitHub + demo online trước khi nộp hồ sơ tháng …)* |

---

## 2. Tech stack

| Phần | Công nghệ | Lý do chọn (✏️ tự viết – quan trọng khi phỏng vấn) |
|---|---|---|
| Frontend framework | Vue 3 (Composition API, `<script setup>`) | ✏️ |
| Ngôn ngữ | JavaScript (TypeScript → Phase 2) | ✏️ |
| Build tool | Vite | ✏️ |
| State management | Pinia | ✏️ |
| Routing | Vue Router | ✏️ |
| CSS | CSS thuần + `<style scoped>` | ✏️ |
| Backend | MVP: không có (dữ liệu trong `localStorage`) · Phase 2: Node.js + Express | ✏️ |
| Database | MVP: `localStorage` · Phase 2: MariaDB | ✏️ |
| DB-Connector | ✏️ *(`mariadb` hoặc `mysql2`)* | ✏️ |
| Testing | Vitest | ✏️ |
| Deploy | Netlify (static) | ✏️ |

**Phiên bản đã cài** (ghi lại bằng `node -v`, `npm -v`, `mariadb --version`):
- Node: v24.21.0
- npm: 11.19.0
- MariaDB: 

---

## 3. Phạm vi chức năng

### 3.1 MVP (phiên bản đầu tiên – phải xong trước)

Viết dưới dạng **User Story**: *"Là người dùng, tôi muốn … để …"*

- [ ] Là người dùng, tôi muốn thêm một hồ sơ mới (công ty, vị trí, link) để không quên các vị trí đã tìm thấy.
- [ ] Là người dùng, tôi muốn đổi trạng thái hồ sơ để biết mình đang ở bước nào.
- [ ] Là người dùng, tôi muốn có sự phân tích mỗi job dựa vào hồ sơ của mình để xem công việc có phù hợp không
- [ ] Là người dùng, tôi muốn thông tin của mỗi công ty tôi thích hoặc đang apply sẽ được tổng hợp lại để chuẩn bị cho interview 
- [ ] Là người dùng tôi muốn có sự so sánh lương giữa các công việc

### 3.2 Phase 2 (sau khi MVP chạy ổn)

- [ ] ✏️ *(Gợi ý: Kanban kéo-thả, CSV-Export, nhắc deadline …)*
- [ ] ✏️

### 3.3 Phase 3 (nếu còn thời gian)

- [ ] ✏️ *(Gợi ý: thống kê/biểu đồ, đăng nhập, dark mode …)*
- [ ] ✏️

### 3.4 Không làm (Out of scope)

✏️ *(Ghi rõ những gì bạn cố ý KHÔNG làm, để tránh project phình to.)*

---

## 4. Mô hình dữ liệu (Datenmodell)

### 4.1 Bảng `applications` – bản nháp

| Cột | Kiểu dữ liệu | Bắt buộc? | Ghi chú |
|---|---|---|---|
| `id` | INT, AUTO_INCREMENT, PK | ✔ | |
| `company` | VARCHAR(255) | ✔ | |
| `position` | VARCHAR(255) | ✔ | |
| `status` | ENUM(…) | ✔ | Các giá trị: xem 4.2 |
| ✏️ | | | |
| ✏️ | | | |
| `created_at` | TIMESTAMP | ✔ | tự động |
| `updated_at` | TIMESTAMP | ✔ | tự động |

**Câu hỏi cần tự quyết định:**
- ✏️ Cần lưu những thông tin nào? (Ort, Homeoffice ja/nein, Gehalt, Ansprechpartner, Link, Deadline, Notizen …)
- ✏️ Có cần bảng riêng cho công ty (`companies`) không, hay để chung?
- ✏️ Có cần lưu lịch sử đổi trạng thái (`status_history`) để làm thống kê không?

### 4.2 Các trạng thái (Status) và chuyển đổi

| Trạng thái | Ý nghĩa | Được chuyển sang |
|---|---|---|
| `gespeichert` | Đã lưu, chưa nộp | ✏️ |
| `beworben` | Đã nộp hồ sơ | ✏️ |
| `interview` | Được mời phỏng vấn | ✏️ |
| `zusage` | Được nhận | ✏️ |
| `absage` | Bị từ chối | ✏️ |
| ✏️ | | |

### 4.3 SQL (viết sau khi quyết định xong 4.1)

```sql
-- ✏️ CREATE TABLE ...
```

---

## 5. Thiết kế API (REST)

**Base URL:** `/api`

| Method | Endpoint | Chức năng | Request body | Response | Status code |
|---|---|---|---|---|---|
| GET | `/applications` | Lấy danh sách | – | ✏️ | 200 |
| GET | `/applications/:id` | Lấy 1 hồ sơ | – | ✏️ | 200 / 404 |
| POST | `/applications` | Tạo mới | ✏️ | ✏️ | 201 / 400 |
| PUT | `/applications/:id` | Sửa | ✏️ | ✏️ | ✏️ |
| PATCH | `/applications/:id/status` | Đổi trạng thái | ✏️ | ✏️ | ✏️ |
| DELETE | `/applications/:id` | Xóa | – | – | ✏️ |
| ✏️ | | | | | |

**Query-Parameter cho lọc/tìm kiếm:** ✏️ *(Ví dụ: `?status=beworben&q=rewe&sort=deadline`)*

**Validation (server kiểm tra gì?):** ✏️

**Format lỗi thống nhất:** ✏️ *(Ví dụ: `{ "error": "company is required" }`)*

**Bảo mật:** chỉ dùng SQL-Query có tham số (`?`), không ghép chuỗi. ✏️ *(thêm gì nữa?)*

---

## 6. Thiết kế Frontend

### 6.1 Các trang (Routes)

| Route | Trang (View) | Nội dung |
|---|---|---|
| `/` | ✏️ | ✏️ |
| `/applications/new` | ✏️ | ✏️ |
| `/applications/:id` | ✏️ | ✏️ |
| `/applications/:id/edit` | ✏️ | ✏️ |
| ✏️ | | |

### 6.2 Component

| Component | Nhiệm vụ | Props (nhận vào) | Emits (gửi ra) |
|---|---|---|---|
| *Ví dụ:* `StatusBadge` | Hiển thị trạng thái có màu | `status` | – |
| ✏️ `ApplicationList` | | | |
| ✏️ `ApplicationForm` | | | |
| ✏️ `FilterBar` | | | |
| ✏️ | | | |

**Cây component** (vẽ bằng chữ):

```
App
└── ✏️
```

### 6.3 Pinia Store

| Phần | Nội dung |
|---|---|
| **State** | ✏️ *(Ví dụ: `applications`, `isLoading`, `error`, `filter`)* |
| **Getters** | ✏️ *(Ví dụ: danh sách đã lọc, số hồ sơ theo trạng thái)* |
| **Actions** | ✏️ *(Ví dụ: `fetchAll`, `create`, `update`, `remove`)* |

### 6.4 TypeScript Types

```ts
// ✏️ Định nghĩa kiểu dữ liệu, khớp với bảng ở mục 4
// export type Status = ...
// export interface Application { ... }
```

### 6.5 Wireframes

- Màn hình danh sách: ✏️ *(link Excalidraw / ảnh chụp bản vẽ tay)*
- Form thêm/sửa: ✏️
- Trang chi tiết: ✏️

### 6.6 Trải nghiệm người dùng (UX)

- Hiển thị gì khi đang tải dữ liệu? ✏️
- Hiển thị gì khi danh sách trống? ✏️
- Hiển thị gì khi có lỗi? ✏️
- Có cần xác nhận trước khi xóa không? ✏️
- Giao diện trên điện thoại (responsive)? ✏️

---

## 7. Cấu trúc thư mục

```
Vuejs-Projekt/
├── PLAN.md            ← file này
├── README.md
├── .gitignore
├── client/            ← Vue (npm create vue@latest client)
│   └── src/
│       ├── components/
│       ├── views/
│       ├── stores/
│       ├── router/
│       ├── types/
│       └── ✏️
└── server/            ← Express + MariaDB
    ├── .env           ← KHÔNG commit!
    └── ✏️
```

---

## 8. Lộ trình theo tuần

> Điều chỉnh theo thời gian thực tế của bạn. Mỗi tuần ghi lại ngày bắt đầu.

### Tuần 0 – Chuẩn bị (ngày: ✏️)
- [ ] Cài Node.js LTS, Git, VS Code + "Vue - Official", Vue DevTools, MariaDB
- [ ] Làm tutorial chính thức: https://vuejs.org/tutorial/
- [ ] Ôn JS hiện đại (destructuring, modules, async/await) + TypeScript cơ bản
- [ ] Hoàn thành mục 1–6 của file này (ít nhất bản nháp)

### Tuần 1 – Setup & Database (ngày: ✏️)
- [ ] `git init`, tạo repo GitHub, `.gitignore`
- [ ] Tạo database + bảng (mục 4.3)
- [ ] Setup Express, kết nối MariaDB, file `.env`
- [ ] ✏️

### Tuần 2 – Backend API (ngày: ✏️)
- [ ] Viết các endpoint ở mục 5
- [ ] Test từng endpoint bằng Thunder Client / Bruno
- [ ] Validation + xử lý lỗi
- [ ] ✏️

### Tuần 3 – Frontend cơ bản (ngày: ✏️)
- [ ] `npm create vue@latest client` (TypeScript, Router, Pinia, Vitest, ESLint, Prettier)
- [ ] Cấu hình Vite-Proxy `/api` → `http://localhost:3000`
- [ ] Types + Pinia Store
- [ ] Trang danh sách + form
- [ ] ✏️

### Tuần 4 – Hoàn thiện MVP (ngày: ✏️)
- [ ] Lọc, tìm kiếm, đổi trạng thái
- [ ] Loading / Empty / Error States
- [ ] ✏️

### Tuần 5 – Test, README, Deploy (ngày: ✏️)
- [ ] Viết test Vitest (mục 10)
- [ ] README (mục 12)
- [ ] Deploy (mục 11)
- [ ] ✏️

### Tuần 6+ – Phase 2 (ngày: ✏️)
- [ ] ✏️

---

## 9. Quy tắc làm việc với Git

- **Branch:** ✏️ *(Ví dụ: `main` luôn chạy được; làm tính năng trên `feature/ten-tinh-nang`)*
- **Commit message:** ✏️ *(Ví dụ theo Conventional Commits: `feat: add status filter`, `fix: …`, `docs: …`)*
- **Quản lý việc cần làm:** ✏️ *(GitHub Issues / GitHub Projects?)*

---

## 10. Kế hoạch kiểm thử (Testing)

| Cần test | Loại test | Công cụ | Xong? |
|---|---|---|---|
| *Ví dụ:* Getter lọc theo trạng thái trong Pinia Store | Unit | Vitest | [ ] |
| ✏️ | | | [ ] |
| ✏️ | | | [ ] |

---

## 11. Deploy

| Phần | Nơi deploy | Ghi chú |
|---|---|---|
| Frontend | ✏️ | |
| Backend | ✏️ | |
| Database | ✏️ | |
| Link demo | ✏️ | |

---

## 12. README & CV

**README cần có:**
- [ ] Mô tả ngắn project + ảnh chụp màn hình / GIF
- [ ] Tech stack
- [ ] Hướng dẫn cài đặt & chạy local
- [ ] Link demo
- [ ] Những gì học được / thách thức đã giải quyết
- [ ] ✏️

**Dòng CV (viết khi project xong – chỉ ghi những gì đã làm thật):**

> ✏️

---

## 13. Nhật ký quyết định (Decision Log)

> Ghi lại mỗi quyết định kỹ thuật quan trọng – đây là "kho câu trả lời" cho phỏng vấn.

| Ngày | Quyết định | Lý do | Phương án khác đã cân nhắc |
|---|---|---|---|
| ✏️ | | | |

---

## 14. Nhật ký học tập & vấn đề gặp phải

| Ngày | Vấn đề / Điều học được | Cách giải quyết | Nguồn tham khảo |
|---|---|---|---|

ERESOLVE eslint@undefined → nguyên nhân: cache ~/.npm có file thuộc root → sửa bằng chown
---

## 15. Câu hỏi còn mở

- [ ] ✏️

---

## 16. Tài liệu tham khảo (chính thức)

- Vue.js Guide: https://vuejs.org/guide/introduction.html
- Vue.js Tutorial: https://vuejs.org/tutorial/
- Vue Router: https://router.vuejs.org/
- Pinia: https://pinia.vuejs.org/
- Vite: https://vite.dev/
- Vitest: https://vitest.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Express: https://expressjs.com/
- MariaDB Node.js Connector: https://mariadb.com/docs/connectors/mariadb-connector-nodejs/
- MariaDB SQL (CREATE TABLE): https://mariadb.com/docs/server/reference/sql-statements/data-definition/create/create-table
