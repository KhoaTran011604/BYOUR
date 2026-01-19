-- ==================== DEMO COMPONENTS FOR SHAPER TESTING ====================
-- This script adds demo component support for embedded feature demos in the testing flow

-- Add demo_component and demo_instructions columns to shaper_testing_features
ALTER TABLE shaper_testing_features
  ADD COLUMN demo_component TEXT, -- Component key for embedded demo (e.g., "hq-rating", "boss-feedback")
  ADD COLUMN demo_instructions TEXT; -- Instructions for using the demo

-- Add comments for documentation
COMMENT ON COLUMN shaper_testing_features.demo_component IS 'Component key that maps to a React demo component (e.g., "hq-rating" maps to HQRatingDemo)';
COMMENT ON COLUMN shaper_testing_features.demo_instructions IS 'Instructions displayed in the demo area for testers';

-- ==================== UPDATE EXISTING DATA ====================

-- Update existing testing features with demo components
UPDATE shaper_testing_features
SET
  demo_component = 'generic',
  demo_instructions = 'Vui lòng sử dụng URL test để trải nghiệm tính năng này.'
WHERE demo_component IS NULL;

-- ==================== SEED DATA: HQ Rating Feature ====================

-- Add HQ Rating testing feature with embedded demo
INSERT INTO shaper_testing_features (
  name,
  description,
  version,
  status,
  due_date,
  testers_count,
  bugs_count,
  test_url,
  docs_url,
  demo_component,
  demo_instructions
) VALUES (
  'HQ Rating for Boss',
  'Cho phép Boss đánh giá HQ sau khi hoàn thành dự án. Đánh giá bao gồm sao, nhận xét, và khuyến nghị.',
  'v2.9.0-beta',
  'testing',
  '2024-03-01',
  0,
  0,
  NULL,
  '/docs/features/hq-rating',
  'hq-rating',
  'Thử nghiệm tính năng đánh giá Boss:
1. Chọn một Boss từ danh sách mock
2. Thử đánh giá sao (1-5)
3. Chọn có/không giới thiệu
4. Nhập nhận xét (tùy chọn)
5. Gửi đánh giá và xem kết quả

Lưu ý: Đây là môi trường demo, dữ liệu không được lưu thực tế.'
);

-- Get the ID of the newly inserted feature for test checklists
DO $$
DECLARE
  hq_rating_feature_id UUID;
BEGIN
  SELECT id INTO hq_rating_feature_id
  FROM shaper_testing_features
  WHERE name = 'HQ Rating for Boss'
  LIMIT 1;

  -- Add test checklists for HQ Rating feature
  INSERT INTO shaper_test_checklists (feature_id, title, description, test_steps, expected_result, order_index, is_critical) VALUES
  (
    hq_rating_feature_id,
    'Hiển thị danh sách Boss có thể đánh giá',
    'Kiểm tra danh sách Boss được hiển thị đúng',
    ARRAY[
      'Mở trang Demo',
      'Xem danh sách Boss được hiển thị',
      'Kiểm tra thông tin của mỗi Boss (tên, công ty, rating hiện tại)'
    ],
    'Danh sách Boss hiển thị đầy đủ với thông tin chính xác và giao diện dễ nhìn',
    1,
    TRUE
  ),
  (
    hq_rating_feature_id,
    'Chọn Boss để đánh giá',
    'Kiểm tra việc chọn Boss hoạt động đúng',
    ARRAY[
      'Click vào một Boss trong danh sách',
      'Form đánh giá phải xuất hiện',
      'Thông tin Boss được chọn hiển thị ở form'
    ],
    'Form đánh giá mở ra với thông tin Boss đúng, có thể chọn Boss khác',
    2,
    TRUE
  ),
  (
    hq_rating_feature_id,
    'Đánh giá sao (Star Rating)',
    'Kiểm tra tính năng đánh giá sao',
    ARRAY[
      'Trong form đánh giá, click vào các sao',
      'Thử hover lên các sao',
      'Thử thay đổi số sao đã chọn'
    ],
    'Sao được highlight khi chọn, có animation khi hover, có thể thay đổi rating',
    3,
    TRUE
  ),
  (
    hq_rating_feature_id,
    'Nút Có/Không giới thiệu',
    'Kiểm tra nút recommend',
    ARRAY[
      'Click nút "Có"',
      'Kiểm tra trạng thái nút',
      'Click nút "Không"',
      'Kiểm tra nút đổi trạng thái'
    ],
    'Nút được highlight khi chọn, chỉ một nút được chọn tại một thời điểm',
    4,
    TRUE
  ),
  (
    hq_rating_feature_id,
    'Nhập nhận xét',
    'Kiểm tra ô textarea nhận xét',
    ARRAY[
      'Click vào ô nhận xét',
      'Nhập một đoạn text dài',
      'Kiểm tra placeholder và label'
    ],
    'Có thể nhập text thoải mái, ô textarea tự động giãn hoặc có scroll',
    5,
    FALSE
  ),
  (
    hq_rating_feature_id,
    'Gửi đánh giá thành công',
    'Kiểm tra flow submit đánh giá',
    ARRAY[
      'Điền đầy đủ rating và recommend',
      'Click nút "Gửi đánh giá"',
      'Xem thông báo kết quả'
    ],
    'Hiển thị màn hình thành công với thông tin đánh giá vừa submit',
    6,
    TRUE
  ),
  (
    hq_rating_feature_id,
    'Validation - Không thể submit thiếu thông tin bắt buộc',
    'Kiểm tra validation',
    ARRAY[
      'Không chọn rating sao',
      'Thử click nút Submit',
      'Không chọn recommend yes/no',
      'Thử click nút Submit'
    ],
    'Nút Submit bị disable hoặc hiển thị thông báo lỗi khi thiếu thông tin bắt buộc',
    7,
    TRUE
  ),
  (
    hq_rating_feature_id,
    'Reset và đánh giá Boss khác',
    'Kiểm tra tính năng reset',
    ARRAY[
      'Sau khi submit thành công',
      'Click nút "Thử lại với Boss khác"',
      'Chọn một Boss khác để đánh giá'
    ],
    'Form được reset, có thể chọn Boss khác và đánh giá mới',
    8,
    FALSE
  );
END $$;

-- Add feature rollout entry for HQ Rating
INSERT INTO feature_rollouts (
  feature_key,
  feature_name,
  description,
  enabled_for_shapers,
  enabled_for_boss,
  enabled_for_hq,
  min_tests_required,
  min_success_rate,
  status
) VALUES (
  'hq_rating_for_boss',
  'HQ Rating for Boss',
  'Rating system for Boss to rate HQ after project completion',
  TRUE,
  FALSE,
  FALSE,
  5,
  80,
  'testing'
);
