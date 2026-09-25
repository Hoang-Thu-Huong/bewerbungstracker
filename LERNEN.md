# LERNEN – Nhật ký học tập

Tài liệu này ghi lại những gì đã học được trong quá trình xây dựng **Bewerbungstracker** (Vue 3, Pinia, Vue Router, Vitest).

Sau mỗi task, một mục mới được thêm vào cuối file: khái niệm Vue/JS nào đã dùng, tại sao dùng, trong file nào, kèm link tới tài liệu chính thức (vuejs.org, pinia.vuejs.org, router.vuejs.org, MDN).

---

## Task 1 – Hiển thị danh sách Bewerbungen cố định (hardcoded) trong `HomeView.vue`

**File:** `client/src/views/HomeView.vue`
**Commit:** `feat: show hardcoded application list`

### Đã làm gì

Thay component mẫu `TheWelcome` bằng một danh sách 3 Bewerbungen viết cứng trong code (chưa có localStorage hay backend). Mỗi Bewerbung có đủ các field theo Data model trong `CLAUDE.md` (`id`, `company`, `position`, `link`, `ort`, `gehaltMin`, `gehaltMax`, `status`, `datum`, `notizen`, `createdAt`, `updatedAt`), nhưng template hiện chỉ hiển thị `company`, `position`, `status`.

### Khái niệm đã dùng

#### 1. `ref()` – tạo state reactive

```js
import { ref } from 'vue'
const applications = ref([ /* ... */ ])
```

- `ref()` bọc một giá trị (ở đây là mảng) vào một **đối tượng reactive**. Khi giá trị thay đổi, Vue tự động render lại những chỗ trong template dùng nó.
- Trong `<script setup>` phải truy cập qua `applications.value`; trong `<template>` Vue tự "unwrap", nên viết `applications` là đủ.
- **Tại sao dùng `ref` ngay cả khi dữ liệu còn cố định?** Vì ở các task sau danh sách sẽ thay đổi (thêm/xóa/sửa Bewerbung, load từ localStorage). Chuẩn bị từ đầu bằng `ref` giúp không phải sửa lại cấu trúc. Đây cũng là pattern dùng trong Pinia setup-store sau này.
- Với mảng/object, có thể dùng `reactive()` thay thế, nhưng `ref()` là cách được khuyến nghị vì nhất quán và có thể gán lại toàn bộ giá trị (`applications.value = [...]`), điều `reactive()` không cho phép.
- Docs: https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref · https://vuejs.org/api/reactivity-core.html#ref

#### 2. `v-for` – render danh sách

```html
<li v-for="application in applications" :key="application.id">
```

- `v-for` lặp qua mảng và tạo ra một `<li>` cho mỗi phần tử. Cú pháp `item in items` (giống `for...of` trong JS).
- Biến `application` chỉ tồn tại **bên trong** phần tử có `v-for` (block scope), giống biến trong vòng lặp JS.
- Có thể lấy thêm index: `v-for="(application, index) in applications"`.
- Docs: https://vuejs.org/guide/essentials/list.html

#### 3. `:key` – định danh phần tử trong danh sách

```html
:key="application.id"
```

- `:key` là viết tắt của `v-bind:key`. Giá trị phải **duy nhất và ổn định** cho mỗi phần tử, nên dùng `id`, **không** dùng index.
- Vue dùng `key` để biết phần tử nào là phần tử nào khi danh sách thay đổi (sắp xếp, xóa, thêm). Nhờ đó Vue chỉ di chuyển/cập nhật DOM cần thiết thay vì render lại tất cả, và không bị lỗi state "nhảy" sang phần tử khác (ví dụ input đang gõ, animation).
- ESLint rule `vue/require-v-for-key` (trong preset `flat/essential` mà dự án dùng) sẽ báo lỗi nếu quên `:key`.
- Docs: https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key · https://vuejs.org/api/built-in-special-attributes.html#key

#### 4. Text interpolation (Mustache) – `{{ }}`

```html
<span>{{ application.company }}</span>
```

- Cặp ngoặc nhọn đôi (Mustache syntax) chèn giá trị JS vào text của DOM. Bên trong có thể viết **một biểu thức JS** bất kỳ (`{{ a + b }}`, `{{ ok ? 'ja' : 'nein' }}`), nhưng không viết statement (`if`, `for`).
- Giá trị được render dưới dạng **text thuần**, không phải HTML, nên an toàn trước XSS. Muốn render HTML thật phải dùng `v-html` (tránh dùng với dữ liệu người dùng).
- Khi `applications` thay đổi, các đoạn text này tự cập nhật – đó chính là lý do cần `ref()` ở trên.
- Docs: https://vuejs.org/guide/essentials/template-syntax.html#text-interpolation

#### 5. Nhắc lại: `<script setup>` và `<style scoped>`

- `<script setup>`: mọi biến top-level (ở đây `applications`) tự động dùng được trong template, không cần `return`. Docs: https://vuejs.org/api/sfc-script-setup.html
- `<style scoped>`: CSS chỉ áp dụng cho component này, tránh đụng class `.status` ở component khác sau này (ví dụ `StatusBadge`). Dùng CSS variables từ `base.css` (`--color-border`, `--color-background-soft`, ...) để tự hỗ trợ dark mode. Docs: https://vuejs.org/api/sfc-css-features.html#scoped-css

### Ghi chú JS

- Chuỗi ngày `datum` dùng định dạng ISO `YYYY-MM-DD`, `createdAt`/`updatedAt` dùng ISO 8601 đầy đủ (giống output của `new Date().toISOString()`), để sau này dễ sort và gửi lên REST API. MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
- `status` dùng đúng các giá trị enum tiếng Đức trong `CLAUDE.md`: `gespeichert`, `beworben`, `interview`, `zusage`, `absage`.
