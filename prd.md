# BYOUR - Product Requirements Document (PRD)

**Version:** 1.0  
**Ngày tạo:** 14/01/2026  
**Giai đoạn:** MVP (8 tuần)  
**Thị trường:** Ireland

---

## 1. TỔNG QUAN SẢN PHẨM

### 1.1 Tầm nhìn

BYOUR là "văn phòng kỹ thuật số" dành cho freelancer và doanh nghiệp nhỏ tại Ireland — nơi các chuyên gia độc lập có thể xây dựng thương hiệu cá nhân, kết nối khách hàng và hoàn tất giao dịch trong một hệ sinh thái khép kín.

### 1.2 Vấn đề cần giải quyết

| Đối tượng        | Pain Points                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Freelancer       | Thiếu công cụ tạo website chuyên nghiệp nhanh chóng; phải dùng nhiều nền tảng rời rạc (portfolio, thanh toán, liên lạc) |
| Doanh nghiệp nhỏ | Khó tìm freelancer phù hợp; quy trình thuê và thanh toán phức tạp                                                       |

### 1.3 Giải pháp

Một nền tảng duy nhất với:

- **1 tài khoản → 4 chế độ** linh hoạt
- **Vòng lặp khép kín:** Danh tính → Dự án → Kết nối → Cộng tác → Thanh toán
- **Website builder** với thiết kế "locked style" đảm bảo thẩm mỹ cao cấp

---

## 2. MỤC TIÊU VÀ CHỈ SỐ THÀNH CÔNG

### 2.1 Mục tiêu MVP

- Ra mắt sản phẩm hoạt động đầy đủ trong **8 tuần**
- Hỗ trợ **thị trường Ireland** (pháp lý, thanh toán EUR)
- Xác thực product-market fit với nhóm early adopters

### 2.2 KPIs đề xuất

| Chỉ số                             | Mục tiêu (3 tháng sau launch) |
| ---------------------------------- | ----------------------------- |
| Số tài khoản đăng ký               | 500+                          |
| Số website được publish            | 200+                          |
| Tỷ lệ hoàn thành onboarding        | ≥ 60%                         |
| Số giao dịch thanh toán thành công | 50+                           |

---

## 3. ĐỐI TƯỢNG NGƯỜI DÙNG

### 3.1 Personas

#### Persona 1: Freelancer (Boss Mode)

- **Tên:** Sarah, 28 tuổi
- **Nghề nghiệp:** Graphic Designer tự do tại Dublin
- **Nhu cầu:** Tạo portfolio online chuyên nghiệp, nhận thanh toán dễ dàng
- **Frustration:** Không có thời gian học code/WordPress; Wix quá phức tạp

#### Persona 2: Doanh nghiệp nhỏ (HQ Mode)

- **Tên:** Michael, 42 tuổi
- **Vai trò:** Chủ agency marketing 5 người tại Cork
- **Nhu cầu:** Tìm freelancer đáng tin cậy cho các dự án ngắn hạn
- **Frustration:** Upwork/Fiverr quá đông, khó lọc chất lượng

#### Persona 3: Người mới (Self Mode)

- **Tên:** Emma, 24 tuổi
- **Tình trạng:** Đang cân nhắc chuyển sang freelance
- **Nhu cầu:** Tìm hiểu, khám phá trước khi cam kết

#### Persona 4: Đóng góp nội bộ (Shaper Mode)

- **Vai trò:** Thành viên nội bộ BYOUR
- **Mục đích:** Đóng góp nội dung, hỗ trợ cộng đồng

---

## 4. CẤU TRÚC HỆ THỐNG

### 4.1 Kiến trúc chế độ (Mode Architecture)

```
┌─────────────────────────────────────────────────┐
│              1 TÀI KHOẢN DUY NHẤT               │
├─────────────┬─────────────┬──────────┬──────────┤
│    BOSS     │     HQ      │   SELF   │  SHAPER  │
│ (Freelancer)│ (Business)  │ (Explore)│ (Internal)│
├─────────────┴─────────────┴──────────┴──────────┤
│           CHUYỂN ĐỔI LINH HOẠT (Switcher)       │
└─────────────────────────────────────────────────┘
```

### 4.2 Vòng lặp dự án (Project Loop)

```
DANH TÍNH → DỰ ÁN → KẾT NỐI → CỘNG TÁC → THANH TOÁN
    ↑                                         │
    └─────────────────────────────────────────┘
```

---

## 5. YÊU CẦU CHỨC NĂNG CHI TIẾT

### 5.1 Hệ thống xác thực (Authentication)

#### FR-AUTH-01: Đăng ký tài khoản

| ID           | Mô tả                                         |
| ------------ | --------------------------------------------- |
| FR-AUTH-01.1 | Đăng ký bằng email + password                 |
| FR-AUTH-01.2 | Đăng ký bằng Google OAuth                     |
| FR-AUTH-01.3 | Xác thực email bắt buộc                       |
| FR-AUTH-01.4 | Password tối thiểu 8 ký tự, bao gồm chữ và số |

#### FR-AUTH-02: Đăng nhập

| ID           | Mô tả                         |
| ------------ | ----------------------------- |
| FR-AUTH-02.1 | Đăng nhập bằng email/password |
| FR-AUTH-02.2 | Đăng nhập bằng Google OAuth   |
| FR-AUTH-02.3 | Chức năng "Quên mật khẩu"     |
| FR-AUTH-02.4 | Session timeout: 30 ngày      |

#### FR-AUTH-03: Chọn chế độ (Mode Selection)

| ID           | Mô tả                                           |
| ------------ | ----------------------------------------------- |
| FR-AUTH-03.1 | Hiển thị màn hình chọn mode sau đăng ký lần đầu |
| FR-AUTH-03.2 | Cho phép chuyển đổi mode từ menu settings       |
| FR-AUTH-03.3 | Lưu mode mặc định của user                      |
| FR-AUTH-03.4 | Transition animation mượt giữa các mode         |

---

### 5.2 Boss Mode (Freelancer)

#### FR-BOSS-01: Profile Setup

| ID           | Mô tả                                     | Bắt buộc |
| ------------ | ----------------------------------------- | -------- |
| FR-BOSS-01.1 | Nhập tên hiển thị                         | ✓        |
| FR-BOSS-01.2 | Chọn handle (@username) - unique          | ✓        |
| FR-BOSS-01.3 | Upload avatar (max 5MB, JPG/PNG)          | ✓        |
| FR-BOSS-01.4 | Nhập bio (max 300 ký tự)                  | ✓        |
| FR-BOSS-01.5 | Chọn tags kỹ năng (tối đa 10)             | ✓        |
| FR-BOSS-01.6 | Nhập location (dropdown Ireland counties) | ✓        |

#### FR-BOSS-02: Website Builder

| ID           | Mô tả                                               |
| ------------ | --------------------------------------------------- |
| FR-BOSS-02.1 | Chọn 1 trong 3 template: Minimal, Editorial, Grid   |
| FR-BOSS-02.2 | Preview template trước khi chọn                     |
| FR-BOSS-02.3 | Cho phép đổi template sau khi đã chọn (giữ content) |

#### FR-BOSS-03: Block Editor

| ID           | Mô tả                                            |
| ------------ | ------------------------------------------------ |
| FR-BOSS-03.1 | 4 blocks cố định: Hero, About, Services, Contact |
| FR-BOSS-03.2 | Drag-and-drop để sắp xếp thứ tự blocks           |
| FR-BOSS-03.3 | Không cho phép thêm/xóa blocks                   |
| FR-BOSS-03.4 | Real-time preview khi chỉnh sửa                  |
| FR-BOSS-03.5 | Auto-save mỗi 30 giây                            |

#### FR-BOSS-04: Hero Block

| ID           | Mô tả                            |
| ------------ | -------------------------------- |
| FR-BOSS-04.1 | Upload hero image (max 10MB)     |
| FR-BOSS-04.2 | Nhập headline (max 100 ký tự)    |
| FR-BOSS-04.3 | Nhập subheadline (max 200 ký tự) |
| FR-BOSS-04.4 | CTA button text (max 30 ký tự)   |

#### FR-BOSS-05: About Block

| ID           | Mô tả                                               |
| ------------ | --------------------------------------------------- |
| FR-BOSS-05.1 | Upload profile photo                                |
| FR-BOSS-05.2 | Rich text editor cho about content (max 1000 ký tự) |
| FR-BOSS-05.3 | Hỗ trợ: bold, italic, bullet points, links          |

#### FR-BOSS-06: Services Block

| ID           | Mô tả                                       |
| ------------ | ------------------------------------------- |
| FR-BOSS-06.1 | Thêm service card (không giới hạn số lượng) |
| FR-BOSS-06.2 | Mỗi card gồm: Tên, Mô tả, Giá               |
| FR-BOSS-06.3 | Giá: Fixed price (EUR) HOẶC "Báo giá"       |
| FR-BOSS-06.4 | Sắp xếp thứ tự các service cards            |
| FR-BOSS-06.5 | Xóa service card                            |

#### FR-BOSS-07: Contact Block

| ID           | Mô tả                                                          |
| ------------ | -------------------------------------------------------------- |
| FR-BOSS-07.1 | Form liên hệ: Tên, Email, Message                              |
| FR-BOSS-07.2 | Gửi notification email cho Boss khi có message mới             |
| FR-BOSS-07.3 | Hiển thị social links (optional): LinkedIn, Instagram, Twitter |

#### FR-BOSS-08: Publish Website

| ID           | Mô tả                                              |
| ------------ | -------------------------------------------------- |
| FR-BOSS-08.1 | Nút "Publish" để công khai website                 |
| FR-BOSS-08.2 | URL format: byour.co/[handle]                      |
| FR-BOSS-08.3 | Unpublish để ẩn website                            |
| FR-BOSS-08.4 | Validation: Tất cả required fields phải có content |

---

### 5.3 HQ Mode (Business)

#### FR-HQ-01: Company Profile

| ID         | Mô tả                         | Bắt buộc |
| ---------- | ----------------------------- | -------- |
| FR-HQ-01.1 | Tên công ty                   | ✓        |
| FR-HQ-01.2 | Logo (max 5MB)                | ✓        |
| FR-HQ-01.3 | Mô tả công ty (max 500 ký tự) | ✓        |
| FR-HQ-01.4 | Website URL                   | ✗        |
| FR-HQ-01.5 | Location (Ireland counties)   | ✓        |

#### FR-HQ-02: Discover Bosses

| ID         | Mô tả                                      |
| ---------- | ------------------------------------------ |
| FR-HQ-02.1 | Hiển thị danh sách Boss đã publish website |
| FR-HQ-02.2 | Filter theo tags/kỹ năng                   |
| FR-HQ-02.3 | Filter theo location                       |
| FR-HQ-02.4 | Search theo tên hoặc handle                |
| FR-HQ-02.5 | Thuật toán gợi ý dựa trên tag matching     |

#### FR-HQ-03: View Boss Profile

| ID         | Mô tả                                     |
| ---------- | ----------------------------------------- |
| FR-HQ-03.1 | Xem full website của Boss                 |
| FR-HQ-03.2 | Nút "Contact" để gửi message              |
| FR-HQ-03.3 | Nút "Save" để lưu vào danh sách yêu thích |

#### FR-HQ-04: Saved Bosses

| ID         | Mô tả                      |
| ---------- | -------------------------- |
| FR-HQ-04.1 | Danh sách Boss đã save     |
| FR-HQ-04.2 | Remove khỏi danh sách      |
| FR-HQ-04.3 | Quick contact từ danh sách |

---

### 5.4 Hệ thống thanh toán (Stripe Connect)

#### FR-PAY-01: Boss Onboarding (Stripe)

| ID          | Mô tả                                        |
| ----------- | -------------------------------------------- |
| FR-PAY-01.1 | Kết nối tài khoản Stripe Connect             |
| FR-PAY-01.2 | Redirect đến Stripe onboarding flow          |
| FR-PAY-01.3 | Lưu trạng thái kết nối (pending/active)      |
| FR-PAY-01.4 | Hiển thị badge "Payments enabled" khi active |

#### FR-PAY-02: Tạo Payment Request

| ID          | Mô tả                                |
| ----------- | ------------------------------------ |
| FR-PAY-02.1 | Boss tạo payment request cho HQ      |
| FR-PAY-02.2 | Nhập: Mô tả công việc, Số tiền (EUR) |
| FR-PAY-02.3 | Gửi request qua email đến HQ         |

#### FR-PAY-03: Thanh toán

| ID          | Mô tả                               |
| ----------- | ----------------------------------- |
| FR-PAY-03.1 | HQ nhận email với payment link      |
| FR-PAY-03.2 | Stripe checkout page                |
| FR-PAY-03.3 | Hỗ trợ: Card, Apple Pay, Google Pay |
| FR-PAY-03.4 | Platform fee: [X]% (configurable)   |

#### FR-PAY-04: Dashboard thu nhập (Boss)

| ID          | Mô tả                          |
| ----------- | ------------------------------ |
| FR-PAY-04.1 | Hiển thị tổng thu nhập         |
| FR-PAY-04.2 | Lịch sử giao dịch              |
| FR-PAY-04.3 | Trạng thái: Pending, Completed |

---

### 5.5 Self Mode

#### FR-SELF-01: Explore

| ID           | Mô tả                                |
| ------------ | ------------------------------------ |
| FR-SELF-01.1 | Browse các Boss profiles (read-only) |
| FR-SELF-01.2 | Xem showcase websites mẫu            |
| FR-SELF-01.3 | CTA "Upgrade to Boss" để tạo profile |

---

### 5.6 Shaper Mode

#### FR-SHAPER-01: Internal Access

| ID             | Mô tả                                            |
| -------------- | ------------------------------------------------ |
| FR-SHAPER-01.1 | Chỉ available cho invited users                  |
| FR-SHAPER-01.2 | Quyền truy cập nội dung nội bộ                   |
| FR-SHAPER-01.3 | (Chi tiết tính năng cần clarify với stakeholder) |

---

### 5.7 Tích hợp Canva (MVP Scope)

#### FR-CANVA-01: External Links

| ID            | Mô tả                                          |
| ------------- | ---------------------------------------------- |
| FR-CANVA-01.1 | Hiển thị link đến Canva templates trong editor |
| FR-CANVA-01.2 | Mở Canva trong tab mới                         |
| FR-CANVA-01.3 | User tự download và upload lại vào BYOUR       |

---

## 6. YÊU CẦU PHI CHỨC NĂNG

### 6.1 Performance

| ID          | Yêu cầu                                       |
| ----------- | --------------------------------------------- |
| NFR-PERF-01 | Page load time < 3 giây (3G connection)       |
| NFR-PERF-02 | Time to Interactive < 5 giây                  |
| NFR-PERF-03 | Image optimization: WebP format, lazy loading |
| NFR-PERF-04 | API response time < 500ms (95th percentile)   |

### 6.2 Scalability

| ID           | Yêu cầu                                            |
| ------------ | -------------------------------------------------- |
| NFR-SCALE-01 | Hỗ trợ 1,000 concurrent users                      |
| NFR-SCALE-02 | Database: PostgreSQL với connection pooling        |
| NFR-SCALE-03 | File storage: Cloud storage (AWS S3/Cloudflare R2) |

### 6.3 Security

| ID         | Yêu cầu                               |
| ---------- | ------------------------------------- |
| NFR-SEC-01 | HTTPS bắt buộc                        |
| NFR-SEC-02 | Password hashing: bcrypt              |
| NFR-SEC-03 | CSRF protection                       |
| NFR-SEC-04 | Rate limiting: 100 requests/minute/IP |
| NFR-SEC-05 | Input sanitization (XSS prevention)   |
| NFR-SEC-06 | GDPR compliance (Ireland/EU)          |

### 6.4 Accessibility

| ID          | Yêu cầu                      |
| ----------- | ---------------------------- |
| NFR-A11Y-01 | WCAG 2.1 Level AA compliance |
| NFR-A11Y-02 | Keyboard navigation support  |
| NFR-A11Y-03 | Screen reader compatible     |
| NFR-A11Y-04 | Color contrast ratio ≥ 4.5:1 |

### 6.5 Responsive Design

| ID          | Yêu cầu                                   |
| ----------- | ----------------------------------------- |
| NFR-RESP-01 | Mobile-first approach                     |
| NFR-RESP-02 | Breakpoints: 320px, 768px, 1024px, 1440px |
| NFR-RESP-03 | Touch-friendly (min tap target: 44x44px)  |
| NFR-RESP-04 | Cả 3 templates phải responsive hoàn chỉnh |

### 6.6 Browser Support

| ID             | Yêu cầu                   |
| -------------- | ------------------------- |
| NFR-BROWSER-01 | Chrome (last 2 versions)  |
| NFR-BROWSER-02 | Firefox (last 2 versions) |
| NFR-BROWSER-03 | Safari (last 2 versions)  |
| NFR-BROWSER-04 | Edge (last 2 versions)    |

---

## 7. TECH STACK ĐỀ XUẤT

### 7.1 Frontend

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand hoặc React Context
- **Drag & Drop:** dnd-kit
- **Forms:** React Hook Form + Zod validation

### 7.2 Backend

- **Runtime:** Node.js
- **Framework:** Next.js API Routes hoặc Express.js
- **Database:** PostgreSQL (Supabase/Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js

### 7.3 Infrastructure

- **Hosting:** Vercel
- **Storage:** Cloudflare R2 hoặc AWS S3
- **CDN:** Cloudflare
- **Payment:** Stripe Connect
- **Email:** Resend hoặc SendGrid

### 7.4 DevOps

- **Version Control:** Git (GitHub)
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics + Sentry

---

## 8. INFORMATION ARCHITECTURE

### 8.1 Sitemap

```
byour.co
├── / (Landing page)
├── /login
├── /signup
├── /forgot-password
├── /[handle] (Public Boss website)
│
├── /dashboard (Protected)
│   ├── /dashboard/boss
│   │   ├── /profile
│   │   ├── /website
│   │   │   ├── /editor
│   │   │   └── /preview
│   │   ├── /payments
│   │   └── /messages
│   │
│   ├── /dashboard/hq
│   │   ├── /profile
│   │   ├── /discover
│   │   ├── /saved
│   │   └── /messages
│   │
│   ├── /dashboard/self
│   │   └── /explore
│   │
│   └── /dashboard/settings
│       ├── /account
│       ├── /mode-switch
│       └── /billing
```

### 8.2 Database Schema (Simplified)

```
Users
├── id (UUID, PK)
├── email (unique)
├── password_hash
├── google_id (nullable)
├── current_mode (enum)
├── created_at
└── updated_at

BossProfiles
├── id (UUID, PK)
├── user_id (FK → Users)
├── handle (unique)
├── display_name
├── avatar_url
├── bio
├── location
├── tags (array)
├── stripe_account_id
├── is_published
└── timestamps

Websites
├── id (UUID, PK)
├── boss_profile_id (FK)
├── template (enum)
├── block_order (array)
├── hero_data (JSON)
├── about_data (JSON)
├── contact_data (JSON)
└── timestamps

Services
├── id (UUID, PK)
├── website_id (FK)
├── name
├── description
├── price (nullable)
├── is_quote_based
├── order
└── timestamps

HQProfiles
├── id (UUID, PK)
├── user_id (FK → Users)
├── company_name
├── logo_url
├── description
├── website_url
├── location
└── timestamps

SavedBosses
├── hq_profile_id (FK)
├── boss_profile_id (FK)
├── saved_at
└── PK (composite)

Messages
├── id (UUID, PK)
├── from_user_id (FK)
├── to_user_id (FK)
├── content
├── is_read
└── created_at

Payments
├── id (UUID, PK)
├── boss_profile_id (FK)
├── hq_profile_id (FK)
├── amount
├── description
├── stripe_payment_id
├── status (enum)
└── timestamps
```

---

## 9. USER FLOWS

### 9.1 Boss Onboarding Flow

```
1. Sign up / Login
       ↓
2. Select Mode: "Boss"
       ↓
3. Create Profile
   - Handle, Name, Avatar, Bio, Tags, Location
       ↓
4. Choose Template
   - Preview 3 options → Select one
       ↓
5. Edit Website (Block Editor)
   - Hero → About → Services → Contact
       ↓
6. Connect Stripe (optional)
       ↓
7. Preview & Publish
       ↓
8. Share URL: byour.co/[handle]
```

### 9.2 HQ Discovery Flow

```
1. Login → HQ Mode
       ↓
2. Go to "Discover"
       ↓
3. Browse / Filter / Search Bosses
       ↓
4. View Boss Website
       ↓
5. Save to List OR Contact
       ↓
6. Send Message / Request Quote
       ↓
7. Receive Payment Request
       ↓
8. Complete Payment via Stripe
```

---

## 10. PHẠM VI MVP VÀ LOẠI TRỪ

### 10.1 Trong phạm vi (In Scope)

| #   | Tính năng                                     |
| --- | --------------------------------------------- |
| 1   | Authentication (Email + Google OAuth)         |
| 2   | 4 Mode system với switcher                    |
| 3   | Boss profile creation                         |
| 4   | Website Builder (3 templates, 4 fixed blocks) |
| 5   | Block Editor với drag-and-drop                |
| 6   | Services management (CRUD)                    |
| 7   | Website publish/unpublish                     |
| 8   | HQ profile creation                           |
| 9   | Boss discovery (filter by tags, location)     |
| 10  | Save bosses to list                           |
| 11  | Basic messaging (contact form)                |
| 12  | Stripe Connect integration                    |
| 13  | Payment request & checkout                    |
| 14  | Basic earnings dashboard                      |
| 15  | Responsive design (3 templates)               |
| 16  | Canva external links                          |

### 10.2 Ngoài phạm vi (Out of Scope)

| #   | Tính năng                                  | Giai đoạn |
| --- | ------------------------------------------ | --------- |
| 1   | AI assistants                              | Phase 2+  |
| 2   | Advanced templates                         | Phase 2+  |
| 3   | Custom domains                             | Phase 2+  |
| 4   | Paid subscriptions (Boss Premium, HQ Paid) | Phase 2+  |
| 5   | Reviews/ratings system                     | Phase 2+  |
| 6   | Public marketplace                         | Phase 2+  |
| 7   | Team HQ accounts                           | Phase 2+  |
| 8   | Mobile app (iOS/Android)                   | Phase 3+  |
| 9   | Calendar integration                       | Phase 2+  |
| 10  | Invoice generation                         | Phase 2+  |
| 11  | Analytics dashboard                        | Phase 2+  |
| 12  | Complex search filters                     | Phase 2+  |
| 13  | Canva SDK integration                      | Phase 2   |
| 14  | Dispute/refund system                      | Phase 2+  |
| 15  | Multi-country support                      | Phase 3+  |

---

## 11. TIMELINE ĐỀ XUẤT (8 TUẦN)

### Phase 1: Foundation (Week 1-2)

- [ ] Project setup (Next.js, DB, Auth)
- [ ] Database schema implementation
- [ ] Authentication system (Email + Google)
- [ ] Mode selection & switcher
- [ ] Basic UI components library

### Phase 2: Boss Features (Week 3-4)

- [ ] Boss profile CRUD
- [ ] Template selection UI
- [ ] Block Editor (drag-and-drop)
- [ ] Hero, About, Contact blocks
- [ ] Services block (CRUD)
- [ ] Preview functionality

### Phase 3: Publish & HQ (Week 5-6)

- [ ] Website publish/unpublish
- [ ] Public website rendering (byour.co/[handle])
- [ ] HQ profile CRUD
- [ ] Discover page (listing + filters)
- [ ] Save bosses functionality
- [ ] Contact/messaging system

### Phase 4: Payments & Polish (Week 7-8)

- [ ] Stripe Connect integration
- [ ] Payment request flow
- [ ] Checkout & confirmation
- [ ] Earnings dashboard
- [ ] Responsive testing (all 3 templates)
- [ ] Bug fixes & QA
- [ ] Performance optimization
- [ ] Soft launch

---

## 12. RỦI RO VÀ GIẢI PHÁP

| Rủi ro                             | Mức độ     | Giải pháp                                             |
| ---------------------------------- | ---------- | ----------------------------------------------------- |
| Block Editor phức tạp hơn dự kiến  | Cao        | Sử dụng thư viện proven (dnd-kit); giảm scope nếu cần |
| Stripe Connect onboarding friction | Trung bình | UX guide rõ ràng; fallback manual process             |
| 3 templates responsive issues      | Cao        | Mobile-first; test sớm trên nhiều devices             |
| Mode switching logic bugs          | Trung bình | Unit tests; clear state management                    |
| Timeline quá tight                 | Cao        | Prioritize ruthlessly; cut features not quality       |

---

## 13. ACCEPTANCE CRITERIA TỔNG QUAN

MVP được coi là hoàn thành khi:

1. ✅ User có thể đăng ký/đăng nhập bằng email hoặc Google
2. ✅ User có thể chọn và chuyển đổi giữa 4 modes
3. ✅ Boss có thể tạo profile đầy đủ
4. ✅ Boss có thể chọn template và edit website với Block Editor
5. ✅ Boss có thể thêm/sửa/xóa services
6. ✅ Boss có thể publish website tại byour.co/[handle]
7. ✅ HQ có thể tạo company profile
8. ✅ HQ có thể browse, filter, và save Bosses
9. ✅ HQ có thể gửi message đến Boss
10. ✅ Boss có thể kết nối Stripe và tạo payment request
11. ✅ HQ có thể hoàn tất thanh toán
12. ✅ Website responsive trên mobile, tablet, desktop
13. ✅ Performance đạt chuẩn (load < 3s)
14. ✅ Không có critical bugs

---

## 14. APPENDIX

### 14.1 Glossary

| Thuật ngữ    | Định nghĩa                                                   |
| ------------ | ------------------------------------------------------------ |
| Boss         | Freelancer/người làm tự do sử dụng BYOUR                     |
| HQ           | Doanh nghiệp/khách hàng tìm kiếm freelancer                  |
| Handle       | Username unique, dùng trong URL (byour.co/[handle])          |
| Block        | Khối nội dung trong website (Hero, About, Services, Contact) |
| Locked Style | Thiết kế cố định, user chỉ edit content không edit layout    |

### 14.2 References

- Stripe Connect Documentation
- GDPR Compliance Guidelines (Ireland)
- WCAG 2.1 Guidelines

---

**Document Owner:** [Tên Product Owner]  
**Last Updated:** 14/01/2026  
**Status:** Draft v1.
