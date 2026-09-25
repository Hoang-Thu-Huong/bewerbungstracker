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

---

## Task 2 – Pinia-Store `applications` + lưu vào `localStorage`

**File:** `client/src/stores/applications.js`, `client/src/stores/seedApplications.js`, `client/src/stores/__tests__/applications.spec.js`, `client/src/views/HomeView.vue`
**Commit:** `feat: add applications store with localStorage`

### Đã làm gì

Chuyển 3 Bewerbungen viết cứng từ `HomeView.vue` sang một **Pinia store** tên `applications`. Store đọc dữ liệu từ `localStorage` (key `bewerbungstracker.applications`) khi khởi động và tự ghi lại mỗi khi mảng thay đổi, nên dữ liệu **còn nguyên sau khi reload**. Có 4 action: `addApplication`, `updateApplication`, `removeApplication`, `getApplicationById`. `HomeView.vue` giờ chỉ lấy danh sách từ store, giao diện không đổi. Gehalt thống nhất là **lương gộp theo năm (Jahresbrutto, Euro)** – entry Zalando đổi từ 1.800–2.200 €/tháng thành 21.600–26.400 €/năm.

### Khái niệm đã dùng

#### 1. `defineStore` với Setup-Syntax (Pinia)

```js
export const useApplicationsStore = defineStore('applications', () => {
  const applications = ref([...])          // state
  function addApplication(data) { ... }    // action
  return { applications, addApplication }
})
```

- Pinia có 2 cách viết store: **Options Store** (`{ state, getters, actions }`) và **Setup Store** (một hàm, giống `<script setup>`). Dự án dùng Setup Store (như `counter.js`).
- Trong Setup Store: `ref()` = state, `computed()` = getter, `function` = action. Mọi thứ muốn dùng bên ngoài phải **`return`** – cái gì không return thì là "private".
- **Tại sao Setup Store?** Cùng một mental model với Composition API trong component, dùng được `watch`, composables, và dễ chuyển sang TypeScript ở Phase 2.
- Tham số đầu `'applications'` là **id duy nhất** của store – Pinia dùng nó cho DevTools và để bảo đảm chỉ có một instance store cho mỗi `pinia`.
- Tên hàm theo convention `useXxxStore` giống composable.
- Docs: https://pinia.vuejs.org/core-concepts/#Setup-Stores · https://pinia.vuejs.org/core-concepts/#Defining-a-Store

#### 2. `ref` vs. `computed`

- `ref(value)`: state **có thể gán/thay đổi** (`applications.value.push(...)`, `applications.value = [...]`). Dùng cho dữ liệu gốc.
- `computed(() => ...)`: giá trị **dẫn xuất** từ state khác, chỉ đọc, được cache và tự tính lại khi dependency thay đổi. Ví dụ `doubleCount` trong `counter.js`. Task này chưa cần computed; ở task sau (FilterBar) danh sách đã lọc sẽ là một `computed`.
- Quy tắc: nếu một giá trị có thể **suy ra** từ giá trị khác → `computed`, không lưu thành `ref` thứ hai (tránh 2 nguồn sự thật lệch nhau).
- Docs: https://vuejs.org/guide/essentials/computed.html · https://vuejs.org/api/reactivity-core.html#computed

#### 3. `storeToRefs` – vì sao không destructuring trực tiếp

```js
const store = useApplicationsStore()
const { applications } = storeToRefs(store)   // ✅ reactive
// const { applications } = store              // ❌ mất reactivity
```

- `store` là một `reactive()` object. Khi destructuring (`const { applications } = store`), JS **copy giá trị tại thời điểm đó** ra biến thường – Vue không còn theo dõi được, template sẽ không cập nhật khi store đổi (giống như destructuring `reactive()` trong Vue).
- `storeToRefs(store)` tạo ra **một `ref` cho mỗi state/getter**, các ref này trỏ về cùng nguồn trong store, nên vẫn reactive. Actions **không** nằm trong `storeToRefs` (hàm không cần reactive) – lấy trực tiếp từ `store`: `store.addApplication(...)`.
- Trong template, `applications` (ref) được auto-unwrap nên viết `v-for="application in applications"` như cũ.
- Docs: https://pinia.vuejs.org/core-concepts/#Using-the-store · https://pinia.vuejs.org/api/pinia/functions/storeToRefs.html · https://vuejs.org/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive

#### 4. `watch` với `{ deep: true }`

```js
watch(applications, saveToStorage, { deep: true })
```

- `watch(source, callback, options)` chạy `callback` khi `source` thay đổi.
- Với một `ref` chứa **mảng/object**, mặc định `watch` chỉ bắn khi **gán lại** `.value` (`applications.value = [...]`). Thay đổi bên trong (`push`, đổi `status` của một phần tử) **không** bắn.
- `deep: true` làm Vue theo dõi **mọi thuộc tính lồng nhau** → `updateApplication` đổi `status` cũng được lưu. Đây là lý do test "persists nested changes" tồn tại.
- Chi phí: deep watch phải duyệt toàn bộ object mỗi lần kiểm tra; với vài chục Bewerbungen thì không đáng kể.
- **Timing:** watcher chạy **bất đồng bộ** (mặc định `flush: 'pre'`, trước khi component render lại). Vì thế trong test phải `await nextTick()` sau `addApplication` rồi mới đọc `localStorage`. Ngoài test, Vue tự gom nhiều thay đổi liên tiếp thành một lần ghi – tốt cho hiệu năng.
- Docs: https://vuejs.org/guide/essentials/watchers.html#deep-watchers · https://vuejs.org/api/reactivity-core.html#watch · https://vuejs.org/api/general.html#nexttick

#### 5. `localStorage` + `JSON.stringify` / `JSON.parse`

```js
localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
```

- `localStorage` là kho key–value **chỉ chứa chuỗi**, lưu theo origin (domain), không hết hạn khi đóng tab. Dung lượng ~5 MB.
- Vì chỉ lưu chuỗi nên phải `JSON.stringify` khi ghi và `JSON.parse` khi đọc. `getItem` trả về `null` nếu key chưa có → kiểm tra `if (!raw) return null`.
- Key có prefix `bewerbungstracker.` để không đụng key của app khác chạy cùng origin (ví dụ `localhost:5173`).
- Sau `JSON.parse` vẫn nên kiểm tra kiểu (`Array.isArray`) – JSON hợp lệ không có nghĩa là đúng cấu trúc mình mong đợi.
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage · https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify · https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

#### 6. `try / catch`

```js
try {
  return JSON.parse(raw)
} catch {
  return null   // dữ liệu hỏng → dùng seed
}
```

- `JSON.parse` **ném lỗi (throw)** nếu chuỗi không phải JSON hợp lệ; `localStorage.setItem` có thể ném lỗi khi hết dung lượng hoặc bị chặn (Safari Private Mode). Không bắt lỗi → app trắng màn hình ngay khi khởi động.
- `catch` **không cần tham số** (`catch { }` thay cho `catch (e) { }`) là "optional catch binding" từ ES2019 – dùng khi không cần đối tượng lỗi.
- Nguyên tắc: bắt lỗi ở **ranh giới với thế giới bên ngoài** (storage, network, parse input), không bọc mọi thứ trong try/catch.
- MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

#### 7. `crypto.randomUUID()`

```js
id: crypto.randomUUID()   // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```

- Tạo UUID v4 ngẫu nhiên, có sẵn trong trình duyệt (secure context: https hoặc localhost) và Node.js ≥ 19 – **không cần thư viện**.
- Thay cho `id: 1, 2, 3` tăng dần: không phải tìm max id, không trùng khi sau này merge dữ liệu từ backend. Vì thế `id` của seed cũng đổi thành **string** (`'seed-1'`) để cả mảng đồng nhất kiểu – route param `/applications/:id` luôn là string, so sánh `===` mới đúng.
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID

#### 8. `structuredClone()` và spread `{ ...data }`

- `structuredClone(seedApplications)` tạo **bản sao sâu** của mảng seed. Nếu dùng thẳng `ref(seedApplications)`, Vue sẽ biến chính module seed thành reactive và mọi `updateApplication` sẽ sửa luôn dữ liệu gốc (test "does not mutate the seed module" kiểm tra điều này).
- Trong `addApplication`: `{ status: 'gespeichert', ...data, id, createdAt, updatedAt }` – thứ tự quan trọng: `status` đứng **trước** `...data` nên là default (bị ghi đè nếu `data.status` có), còn `id`/`createdAt`/`updatedAt` đứng **sau** nên caller không thể ghi đè.
- `Object.assign(application, changes, { id, updatedAt })` trong `updateApplication` cũng theo nguyên tắc đó: `id` luôn được đặt lại cuối cùng.
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone · https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax · https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

#### 9. Test Pinia store với Vitest

```js
beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})
```

- Ngoài component không có `app.use(pinia)`, nên phải gọi `setActivePinia(createPinia())` để `useApplicationsStore()` biết dùng pinia nào. Tạo **pinia mới trong mỗi test** → mỗi test có store sạch, không phụ thuộc thứ tự chạy.
- `localStorage.clear()` cũng trong `beforeEach` vì jsdom giữ `localStorage` chung cho cả file test.
- Test đọc `store.applications` (không cần `.value`) vì Pinia tự unwrap ref khi truy cập qua store.
- Docs: https://pinia.vuejs.org/cookbook/testing.html#Unit-testing-a-store · https://vitest.dev/api/#beforeeach

### Ghi chú

- Vì `watch` chạy bất đồng bộ, việc lưu vào `localStorage` xảy ra **sau** action một tick. Trong app thật không nhận ra, nhưng nếu sau này có `location.reload()` ngay trong action thì phải chú ý.
- `removeApplication` dùng `filter` (tạo mảng mới, gán lại `.value`) thay cho `splice` – dễ đọc hơn và vẫn được `watch` bắt (gán lại `.value` luôn kích hoạt watcher).

---

## Bugfix – `watch` là lazy → `immediate: true`

**File:** `client/src/stores/applications.js`, `client/src/stores/__tests__/applications.spec.js`
**Commit:** `fix: persist seed data on first start`

### Vấn đề

Khi mở app lần đầu (localStorage trống), key `bewerbungstracker.applications` **không được tạo**. Store hiển thị đúng 3 seed, nhưng chỉ khi gọi add/update/remove lần đầu thì dữ liệu mới được ghi. Nguyên nhân: `watch()` mặc định là **lazy** – callback chỉ chạy khi source **thay đổi**, không chạy với giá trị ban đầu.

### Cách sửa

```js
watch(applications, saveToStorage, { deep: true, immediate: true })
```

- `immediate: true` → callback chạy **ngay lập tức, đồng bộ** khi watcher được tạo (với giá trị hiện tại), sau đó tiếp tục chạy mỗi khi có thay đổi như bình thường. Vì thế test mới không cần `await nextTick()`.
- Cách khác: gọi `saveToStorage(applications.value)` bằng tay ngay sau khi tạo `ref`, hoặc dùng `watchEffect` (tự chạy ngay và tự theo dõi dependency). Chọn `immediate` vì vẫn giữ một `watch` duy nhất, rõ ràng source là gì.
- Bài học: test nên có một case "chỉ khởi tạo store, không gọi action" – bug này lọt qua vì mọi test persistence trước đó đều gọi add/update trước khi đọc localStorage.
- Docs: https://vuejs.org/guide/essentials/watchers.html#eager-watchers · https://vuejs.org/api/reactivity-core.html#watch
