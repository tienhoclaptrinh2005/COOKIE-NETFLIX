export const LOCALE_COOKIE = "pixel_press_locale";
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

const en = {
  skipToMain: "SKIP TO MAIN",
  languageLabel: "Language",
  switchToVietnamese: "Switch to Vietnamese",
  switchToEnglish: "Switch to English",
  languageChangeFailed: "Could not change the language. Please try again.",
  brandHome: "VMT SHOP home",
  brandTagline: "CHECK COOKIE NETFLIX",
  systemOnline: "SYSTEM ONLINE",
  admin: "Admin",
  navManualCheck: "Manual check",
  navReceiveToken: "Receive token",
  publicNavAria: "Public tools",
  announcementEyebrow: "ARCADE BROADCAST // NOTICE",
  announcementClose: "Close announcement",
  announcementDismiss: "GOT IT",
  homeNodeReady: "ARCADE NODE 01 // READY",
  homeTitleLine1: "CHECK THE SIGNAL.",
  homeTitleLine2: "KEEP YOUR SECRETS.",
  homeIntro:
    "A privacy-first session analyzer built like the control deck of your favorite 8-bit arcade machine.",
  manualUnlimitedNotice:
    "Manual checking is open and unlimited. Daily credits apply only when receiving a cookie from Redis.",
  receiveNodeReady: "REDIS DISPENSER // READY",
  receiveTitleLine1: "RECEIVE A COOKIE.",
  receiveTitleLine2: "GET A DIRECT TOKEN.",
  receiveIntro:
    "The server selects a stored cookie, verifies it, removes unusable inventory and returns only a safe Netflix Direct Login link.",
  featureFast: "FAST SIGNAL",
  featureFastDetail: "Server-side analysis pipeline",
  featureSafe: "SECRET SAFE",
  featureSafeDetail: "Raw cookie values are never returned",
  featureQuota: "IP QUOTA",
  featureQuotaDetail: "Fair daily guest credits",
  footerPrivacy: "VMT SHOP // PRIVACY-FIRST PROCESSING",
  footerSecrets: "RAW COOKIES ARE NEVER RETURNED TO CLIENT",
  loadingArcade: "LOADING ARCADE...",
  loadingTelemetry: "READING TELEMETRY...",
  notFoundTitle: "LEVEL NOT FOUND",
  notFoundBody: "This route fell outside the map.",
  returnHome: "RETURN HOME",
  guestStatusLoading: "Loading system status",
  guestAwaiting: "AWAITING INPUT",
  guestAwaitingDetail:
    "Run an analysis to reveal a LIVE, DIE or UNKNOWN signal.",
  guestAnalysisComplete: "ANALYSIS COMPLETE",
  guestReference: "Reference",
  guestChecked: "Checked",
  guestStatusUnavailable: "System status is unavailable",
  guestConnectionError:
    "Cannot reach system status. Check your connection and retry.",
  guestInputTooShort:
    "Input is too short. Paste the complete cookie header and try again.",
  guestAnalysisFailed: "Analysis failed.",
  guestAnalysisRetry: "Analysis failed. Please retry.",
  guestAnalyzerTitle: "Session Analyzer",
  guestAnalyzerEyebrow: "Player one // Input deck",
  guestPrivacyNotice:
    "Your raw cookie is processed server-side and is never stored or echoed back. A direct-login token is returned only when you request it.",
  guestCookieLabel: "Cookie header",
  guestCookieHelp:
    "Required fields are detected server-side. Raw cookie values are masked in logs; only the selected result is returned.",
  guestCharCount: "{count} of 16000 characters",
  guestModeLabel: "Result mode",
  guestModeFull: "Full info",
  guestModeToken: "Token only",
  guestModeInfo: "Info only",
  guestModeHelp:
    "Choose whether the result includes account details, a direct-login token, or both.",
  guestAnalyzing: "ANALYZING...",
  guestStart: "START ANALYSIS",
  guestClear: "CLEAR",
  guestClearAria: "Clear input and result",
  guestResultTitle: "Signal Result",
  guestResultEyebrow: "Output channel // Secure",
  guestAccount: "Account",
  guestCountry: "Country",
  guestLanguage: "Language",
  guestPhone: "Phone",
  guestPaymentHold: "Payment hold",
  guestHasAds: "Has ads",
  guestWatchService: "Watch / Service",
  guestDirectLogin: "Direct Login",
  guestTokenWarning:
    "This link grants account access. Do not share it; close or clear this result after use.",
  guestCopyLink: "Copy link",
  guestCopied: "Copied",
  guestCopySuccess: "Direct-login link copied.",
  guestCopyFailed:
    "Could not copy the link. Select it manually and copy again.",
  guestOpenLink: "Open link",
  guestAsideAria: "Connection and Redis receipt quota status",
  guestPlayerStatus: "Player Status",
  guestNetworkTelemetry: "Network telemetry",
  guestMaskedIp: "Masked IP",
  guestVpnProxy: "VPN / Proxy",
  guestVpnClear: "CLEAR",
  guestVpnBlocked: "DETECTED",
  guestVpnUnchecked: "NOT CHECKED",
  guestAccessClass: "Access class",
  guestRoleAdmin: "ADMIN",
  guestRoleGuest: "GUEST",
  guestDailyCredits: "Daily Receipts",
  guestResetTime: "Resets 00:00 ICT",
  guestAdminUnlimited: "Admin receiving is not limited by the guest quota.",
  guestRemaining: "Remaining",
  guestCreditsUsed: "Receipts used",
  guestCreditNotice:
    "Only receiving from Redis uses a daily credit. Manual cookie checks are unlimited.",
  guestSystemLink: "System Link",
  guestRuntimeStatus: "Runtime status",
  guestProcessor: "Processor",
  guestReady: "READY",
  guestRefresh: "REFRESH SIGNAL",
  receivePanelTitle: "Token Dispenser",
  receivePanelEyebrow: "Redis inventory // Server only",
  receiveHowTitle: "How it works",
  receiveHowBody:
    "A cookie stays on the server, is verified through the checker, and is never exposed to your browser. Only a valid Direct Login link is returned.",
  receiveGuestRule:
    "Guests receive one token per request, up to the daily IP limit.",
  receiveAdminRule:
    "Administrators can request a batch of 1–20 tokens and are exempt from the guest quota.",
  receiveQuantity: "Number of tokens",
  receiveQuantityHelp: "Enter a whole number from 1 to 20.",
  receiveGuestSingle: "Guest mode always requests one token.",
  receiveAdminBatch: "ADMIN BATCH MODE",
  receiveButton: "RECEIVE TOKEN",
  receiveButtonMany: "RECEIVE TOKENS",
  receiveLoading: "CHECKING INVENTORY...",
  receiveResultTitle: "Delivered Tokens",
  receiveResultEyebrow: "Direct Login // Private",
  receiveEmpty: "NO TOKEN DELIVERED YET",
  receiveEmptyDetail:
    "Start a request to receive a verified Direct Login link from the Redis inventory.",
  receiveSummary: "Delivered {delivered} of {requested} requested tokens.",
  receiveTokenItem: "TOKEN {index}",
  receiveCopyAll: "COPY ALL LINKS",
  receiveCopiedAll: "ALL LINKS COPIED",
  navOverview: "Overview",
  navRedis: "Redis",
  navSettings: "Settings",
  navOperator: "OPERATOR",
  navElevated: "Elevated session active",
  navAria: "Admin navigation",
  navLogout: "LOG OUT",
  adminControlCenter: "ADMIN CONTROL CENTER",
  adminPrivileged: "PRIVILEGED MODE",
  loginTitle: "Admin Login",
  loginGuestDeck: "Guest deck",
  loginPanelTitle: "Admin Access",
  loginPanelEyebrow: "Restricted zone // Level 8",
  loginIdentity: "IDENTITY CHECK",
  loginDescription:
    "Authenticate to access protected Redis and system controls.",
  loginConfigMissing:
    "Admin login is locked until ADMIN_USERNAME, ADMIN_PASSWORD_HASH and AUTH_SECRET are configured.",
  loginUsername: "Operator ID",
  loginPassword: "Access key",
  loginHidePassword: "Hide password",
  loginShowPassword: "Show password",
  loginFailed: "Login failed.",
  loginRetry: "Login failed. Please retry.",
  loginLoading: "AUTHENTICATING...",
  loginSubmit: "ENTER CONTROL CENTER",
  loginHelp:
    "Password manager and paste are supported. Five failed attempts trigger a 15-minute lock.",
  overviewTitle: "SYSTEM OVERVIEW",
  overviewDescription:
    "Live telemetry, guest activity and protected service health.",
  overviewTotalRequests: "Total requests",
  overviewAllChecks: "All recorded checks",
  overviewGuestQuota: "Guest quota",
  overviewCreditsPerDay: "Redis receipts per IP / day",
  overviewActiveQuota: "Active quota fields",
  overviewCurrentWindow: "Seen in current window",
  overviewAdminQuota: "Admin quota",
  overviewExempt: "Application limit exempt",
  overviewDistribution: "Signal Distribution",
  overviewOutcomes: "Aggregate analysis outcomes",
  overviewAccessibleStatus:
    "Status uses text, icon and color together for accessible scanning.",
  overviewHealth: "Service Health",
  overviewConnections: "Server-only connections",
  overviewRedisStore: "Redis store",
  overviewApiRuntime: "API runtime",
  overviewHealthy: "HEALTHY",
  overviewAuthGuard: "Auth guard",
  overviewActive: "ACTIVE",
  overviewFeed: "Activity Feed",
  overviewNotices: "Latest system notices",
  overviewQuotaEngine: "QUOTA ENGINE",
  overviewCreditsBody: "{limit} guest Redis receipts per day",
  overviewRedisMode: "REDIS MODE",
  overviewControlLink: "CONTROL LINK",
  overviewSessionVerified: "Protected session verified",
  overviewTrafficEyebrow: "PUBLIC TRAFFIC // PRIVACY-SAFE",
  overviewTrafficTitle: "Visitor Analytics",
  overviewTrafficDescription:
    "Page views and anonymous browser estimates for public pages. Administrator and known bot traffic is excluded.",
  overviewTrafficTodayViews: "Page views today",
  overviewTrafficTodayViewsDetail:
    "Loads and client-side page changes since 00:00 ICT",
  overviewTrafficTodayVisitors: "Estimated visitors today",
  overviewTrafficTodayVisitorsDetail:
    "Unique anonymous browser cookies; not a person count",
  overviewTrafficActive: "Active in 5 minutes",
  overviewTrafficActiveDetail:
    "Browsers that loaded a tracked page in the last 5 minutes",
  overviewTrafficTotal: "Total page views",
  overviewTrafficTotalDetail: "Recorded since visitor analytics was enabled",
  overviewTrafficTrend: "7-Day Traffic",
  overviewTrafficTrendDetail: "Daily page views and estimated browsers",
  overviewTrafficDay: "Day",
  overviewTrafficPageViews: "Page-view volume",
  overviewTrafficCount: "Views",
  overviewTrafficVisitorsShort: "Visitors",
  overviewTrafficTopPages: "Top Public Pages",
  overviewTrafficTopPagesDetail: "Page views over the last 7 days",
  overviewTrafficHomePage: "Manual check",
  overviewTrafficReceivePage: "Receive token",
  overviewTrafficLoginPage: "Admin login",
  overviewTrafficPrivacy:
    "No raw IP address, cookie input or account token is stored. Anonymous IDs and IP rate-limit keys are one-way hashed.",
  settingsTitle: "SYSTEM SETTINGS",
  settingsDescription:
    "Tune Redis receipt limits while keeping manual checks unlimited and administrators exempt.",
  settingsGuestQuota: "Guest Receipt Quota",
  settingsRuntime: "Runtime configuration",
  settingsAdminPolicy: "Admin Policy",
  settingsPermissions: "Role permissions",
  settingsUnlimited: "UNLIMITED",
  settingsExempt: "Unlimited Redis receipts and manual checks",
  settingsAdminLimits:
    "Input validation and upstream provider limits still apply to Admin.",
  settingsSecurityRules: "Security Rules",
  settingsServerEnforced: "Server enforced",
  settingsCookieRule: "HttpOnly, Secure, SameSite session cookie",
  settingsExpiryRule: "8-hour session expiration",
  settingsRoleRule: "Server-side role verification for every admin API",
  quotaLabel: "GUEST REDIS RECEIPTS / IP / DAY",
  quotaValidHelp: "Allowed range: 1–100. Reset occurs at 00:00 ICT.",
  quotaInvalidHelp: "Enter a whole number from 1 to 100.",
  quotaSaveFailed: "Save failed.",
  quotaSaved:
    "Guest receipt quota updated. New Redis requests use this limit immediately.",
  quotaSaving: "SAVING...",
  quotaSave: "SAVE QUOTA",
  announcementSettingsTitle: "Guest Announcement Popup",
  announcementSettingsEyebrow: "Editable broadcast // Guests only",
  announcementEnabled: "SHOW POPUP TO GUESTS",
  announcementEnabledHelp:
    "Opens on every page visit or reload. Signed-in administrators do not see it.",
  announcementIconLabel: "ANNOUNCEMENT ICON",
  announcementIcon_megaphone: "Megaphone",
  announcementIcon_info: "Information",
  announcementIcon_gift: "Gift",
  announcementIcon_shield: "Shield",
  announcementIcon_link: "Link",
  announcementVietnamese: "VIETNAMESE CONTENT",
  announcementEnglish: "ENGLISH CONTENT",
  announcementTitleLabel: "TITLE",
  announcementMessageLabel: "MESSAGE",
  announcementLinkLabel: "LINK BUTTON LABEL",
  announcementLinkSection: "OPTIONAL DESTINATION LINK",
  announcementLinkUrl: "LINK URL",
  announcementLinkHelp:
    "Leave blank for no link. Accepts /internal-path or an http(s) URL.",
  announcementLinkInvalid:
    "Enter a safe internal path or a complete http(s) URL.",
  announcementNewTab: "Open the link in a new tab",
  announcementInvalid:
    "Complete both language versions. If a URL is present, add both button labels and use a safe URL.",
  announcementStorageHelp:
    "Stored in Redis: pixel_press → cau_hinh:thong_bao_popup",
  announcementSaveFailed: "Could not save the announcement.",
  announcementSaved:
    "Announcement updated. Guests will see the new content on their next page visit.",
  announcementSaving: "SAVING...",
  announcementSave: "SAVE ANNOUNCEMENT",
  redisTitle: "REDIS MANAGER",
  redisDescription:
    "Application data is grouped in one hash; sensitive values are never sent to the browser.",
  redisConnection: "CONNECTION",
  redisGroups: "DATA GROUPS",
  redisValues: "VALUES",
  redisMasked: "MASKED",
  redisInventory: "Data Inventory",
  redisInventoryEyebrow: "Counts only // No values exposed",
  redisField: "KEY / FIELD",
  redisCount: "COUNT",
  redisClass: "CLASS",
  redisProtected: "PROTECTED",
  redisManaged: "MANAGED",
  redisMaintenance: "Maintenance Bay",
  redisDestructive: "Destructive controls",
  redisDefinitions: "Data Definitions",
  redisOneHash: "One hash for all new data",
  redisProtectedDetail:
    "Protected from bulk deletion; the dispenser keeps LIVE and UNKNOWN cookies and removes only invalid DIE cookies.",
  redisRootDetail:
    "The single Redis Hash containing all application-created data.",
  redisConfigDetail:
    "Maximum Redis receipts allowed for each guest IP per day.",
  redisAnnouncementDetail:
    "Structured guest popup content, icon and optional safe destination link.",
  redisStatsDetail: "Total checks and LIVE, DIE, UNKNOWN result counters.",
  redisReceiveStatsDetail:
    "Redis dispensing requests, delivered tokens and removed invalid cookies.",
  redisQuotaDetail:
    "Redis receipt usage for one guest IP; the field expires after the daily reset.",
  redisLoginDetail:
    "Failed login count; expires after 15 minutes and is deleted after a successful login.",
  redisTrafficDetail:
    "Anonymous page-view counters, daily browser estimates, short-lived deduplication and activity fields.",
  redisWarning:
    "The root keys NetflixId and VN cannot be bulk-deleted here. The dispenser may consume individual verified or invalid members; application counters live in pixel_press.",
  redisConfirm:
    "Delete all {pattern} fields inside pixel_press? This cannot be undone.",
  redisCleanupFailed: "Cleanup failed.",
  redisCleared: "Cleared {count} fields from {pattern}. Reloading...",
  redisClearQuota: "CLEAR QUOTAS",
  redisClearLogin: "CLEAR LOGIN LOCKS",
  redisRefresh: "REFRESH",
  apiWrongOrigin:
    "The request was rejected because it came from an invalid origin.",
  apiAuthNotConfigured: "Administrator authentication is not fully configured.",
  apiTooManyAttempts:
    "Too many failed attempts. Please try again in 15 minutes.",
  apiInvalidLoginData: "The login request is invalid.",
  apiLoginRequired:
    "Enter the username and a password of at least 12 characters.",
  apiBadCredentials: "The username or password is incorrect.",
  apiUnauthorized: "You are not signed in or the session has expired.",
  apiInvalidRequest: "The request data is invalid.",
  apiInvalidNamespace: "This data group cannot be deleted.",
  apiInvalidLimit: "The daily limit must be a whole number from 1 to 100.",
  apiInvalidSettings:
    "The settings are invalid. Check the required text and link format.",
  apiInvalidPayload: "The submitted data is invalid.",
  apiCookieLength: "Enter a complete cookie between 16 and 16,000 characters.",
  apiVpnBlocked:
    "Guests cannot receive from Redis while using a VPN or proxy. Manual checks remain available.",
  apiQuotaExhausted:
    "You have used all Redis receipts for today. The limit resets after 00:00 ICT. Manual checks remain unlimited.",
  apiReceiveQuantity: "The token quantity must be a whole number from 1 to 20.",
  apiReceiveUnavailable:
    "No verified cookie is available right now. Your daily credit was not charged; please try again later.",
  apiReceiveSuccess: "Verified token delivery completed.",
  apiReceivePartial:
    "Only part of the requested batch could be delivered from the current inventory.",
  apiReceiveFailed:
    "The token dispenser is temporarily unavailable. Your daily credit was not charged.",
  apiCookieRecognized:
    "The cookie structure was recognized, but the account status could not be verified.",
  apiCookieFieldsMissing:
    "NetflixId or SecureNetflixId was not found. Check the cookie and try again.",
  apiCookieLive: "The cookie is active and was verified successfully.",
  apiCookieDie: "The cookie is invalid or expired.",
  apiCookieUnknown:
    "The verification service could not determine the cookie status.",
  apiCookieAccepted:
    "The cookie is active and was accepted by the verification service.",
  apiCookieRedirected:
    "The cookie is invalid, expired, or redirected to the sign-in page.",
  apiVerifierUnknown:
    "The verification service returned an unknown error. Try again later.",
  apiVerifierInvalid:
    "The verification server did not return a valid result. Try again later.",
  apiVerifierUnsupported:
    "The verification server returned an unsupported response format.",
  apiVerifierTimeout:
    "The verification server timed out. The cookie was not stored; try again later.",
  vpnNotConfigured: "VPN checking is not configured",
  vpnUnavailable: "The VPN checking service is unavailable",
  vpnDetected: "VPN or proxy detected",
  vpnDirect: "Direct network connection",
  vpnTimeout: "VPN checking timed out",
} as const;

export type Dictionary = { [Key in keyof typeof en]: string };

const vi: Dictionary = {
  skipToMain: "ĐẾN NỘI DUNG CHÍNH",
  languageLabel: "Ngôn ngữ",
  switchToVietnamese: "Chuyển sang tiếng Việt",
  switchToEnglish: "Chuyển sang tiếng Anh",
  languageChangeFailed: "Không thể đổi ngôn ngữ. Vui lòng thử lại.",
  brandHome: "Trang chủ VMT SHOP",
  brandTagline: "CHECK COOKIE NETFLIX",
  systemOnline: "HỆ THỐNG ONLINE",
  admin: "Quản trị",
  navManualCheck: "Check Cookie ",
  navReceiveToken: "Nhận Cookie",
  publicNavAria: "Công cụ công khai",
  announcementEyebrow: "BẢN TIN ARCADE // THÔNG BÁO",
  announcementClose: "Đóng thông báo",
  announcementDismiss: "ĐÃ HIỂU",
  homeNodeReady: "MÁY CHỦ ARCADE 01 // SẴN SÀNG",
  homeTitleLine1: "KIỂM TRA TÍN HIỆU.",
  homeTitleLine2: "GIỮ KÍN BÍ MẬT.",
  homeIntro:
    "Công cụ phân tích phiên ưu tiên quyền riêng tư, được thiết kế như bảng điều khiển máy game 8-bit.",
  manualUnlimitedNotice:
    "Trang check thủ công được mở không giới hạn. Hạn mức mỗi ngày chỉ áp dụng khi nhận cookie từ Redis.",
  receiveNodeReady: "MÁY PHÁT REDIS // SẴN SÀNG",
  receiveTitleLine1: "NHẬN COOKIE.",
  receiveTitleLine2: "LẤY TOKEN TRỰC TIẾP.",
  receiveIntro:
    "Máy chủ chọn cookie đang lưu, kiểm tra, loại bỏ dữ liệu không dùng được và chỉ trả về liên kết Netflix Direct Login an toàn.",
  featureFast: "TÍN HIỆU NHANH",
  featureFastDetail: "Quy trình phân tích phía máy chủ",
  featureSafe: "BẢO MẬT COOKIE",
  featureSafeDetail: "Không bao giờ trả lại cookie gốc",
  featureQuota: "HẠN MỨC IP",
  featureQuotaDetail: "Lượt khách công bằng mỗi ngày",
  footerPrivacy: "VMT SHOP   ",
  footerSecrets: "Sản phẩm nhằm mục đích giải trí . Không thương mại !!!",
  loadingArcade: "ĐANG TẢI ARCADE...",
  loadingTelemetry: "ĐANG ĐỌC DỮ LIỆU...",
  notFoundTitle: "KHÔNG TÌM THẤY MÀN CHƠI",
  notFoundBody: "Đường dẫn này không tồn tại trên bản đồ.",
  returnHome: "VỀ TRANG CHỦ",
  guestStatusLoading: "Đang tải trạng thái hệ thống",
  guestAwaiting: "ĐANG CHỜ DỮ LIỆU",
  guestAwaitingDetail:
    "Hãy chạy kiểm tra để nhận kết quả LIVE, DIE hoặc UNKNOWN.",
  guestAnalysisComplete: "ĐÃ KIỂM TRA XONG",
  guestReference: "Mã tham chiếu",
  guestChecked: "Thời gian kiểm tra",
  guestStatusUnavailable: "Không thể tải trạng thái hệ thống",
  guestConnectionError:
    "Không thể kết nối tới hệ thống. Vui lòng kiểm tra mạng và thử lại.",
  guestInputTooShort:
    "Cookie quá ngắn. Vui lòng dán đầy đủ cookie rồi thử lại.",
  guestAnalysisFailed: "Không thể kiểm tra cookie.",
  guestAnalysisRetry: "Kiểm tra thất bại. Vui lòng thử lại.",
  guestAnalyzerTitle: "Phân tích Cookie",
  guestAnalyzerEyebrow: "Người chơi một // Khu nhập liệu",
  guestPrivacyNotice:
    "Cookie gốc chỉ được xử lý phía máy chủ, không lưu và không trả lại. Token đăng nhập trực tiếp chỉ xuất hiện khi bạn yêu cầu.",
  guestCookieLabel: "Cookie cần kiểm tra",
  guestCookieHelp:
    "Các trường bắt buộc được nhận diện trên máy chủ. Cookie gốc được che trong log; chỉ kết quả đã chọn được trả về.",
  guestCharCount: "{count} trên 16000 ký tự",
  guestModeLabel: "Chế độ kết quả",
  guestModeFull: "Đầy đủ",
  guestModeToken: "Chỉ token",
  guestModeInfo: "Chỉ thông tin",
  guestModeHelp:
    "Chọn trả về thông tin tài khoản, token đăng nhập trực tiếp hoặc cả hai.",
  guestAnalyzing: "ĐANG KIỂM TRA...",
  guestStart: "BẮT ĐẦU KIỂM TRA",
  guestClear: "XÓA",
  guestClearAria: "Xóa dữ liệu nhập và kết quả",
  guestResultTitle: "Kết quả tín hiệu",
  guestResultEyebrow: "Kênh đầu ra // Bảo mật",
  guestAccount: "Tài khoản",
  guestCountry: "Quốc gia",
  guestLanguage: "Ngôn ngữ",
  guestPhone: "Số điện thoại",
  guestPaymentHold: "Tạm giữ thanh toán",
  guestHasAds: "Có quảng cáo",
  guestWatchService: "Xem / Dịch vụ",
  guestDirectLogin: "Đăng nhập trực tiếp",
  guestTokenWarning:
    "Liên kết này có thể cấp quyền truy cập tài khoản. Không chia sẻ và hãy xóa kết quả sau khi dùng.",
  guestCopyLink: "Sao chép link",
  guestCopied: "Đã sao chép",
  guestCopySuccess: "Đã sao chép liên kết đăng nhập trực tiếp.",
  guestCopyFailed: "Không thể sao chép link. Hãy chọn và sao chép thủ công.",
  guestOpenLink: "Mở link",
  guestAsideAria: "Trạng thái kết nối và hạn mức nhận Redis",
  guestPlayerStatus: "Trạng thái người dùng",
  guestNetworkTelemetry: "Dữ liệu mạng",
  guestMaskedIp: "IP đã che",
  guestVpnProxy: "VPN / Proxy",
  guestVpnClear: "AN TOÀN",
  guestVpnBlocked: "PHÁT HIỆN",
  guestVpnUnchecked: "CHƯA KIỂM TRA",
  guestAccessClass: "Loại truy cập",
  guestRoleAdmin: "QUẢN TRỊ",
  guestRoleGuest: "KHÁCH",
  guestDailyCredits: "Lượt nhận hôm nay",
  guestResetTime: "Đặt lại lúc 00:00 VN",
  guestAdminUnlimited:
    "Quản trị viên không bị giới hạn lượt nhận dành cho khách.",
  guestRemaining: "Còn lại",
  guestCreditsUsed: "Lượt nhận đã dùng",
  guestCreditNotice:
    "Chỉ thao tác nhận từ Redis mới dùng lượt mỗi ngày. Check cookie thủ công không giới hạn.",
  guestSystemLink: "Kết nối hệ thống",
  guestRuntimeStatus: "Trạng thái vận hành",
  guestProcessor: "Bộ xử lý",
  guestReady: "SẴN SÀNG",
  guestRefresh: "LÀM MỚI TÍN HIỆU",
  receivePanelTitle: "Máy phát Token",
  receivePanelEyebrow: "Kho Redis // Chỉ máy chủ",
  receiveHowTitle: "Cách hoạt động",
  receiveHowBody:
    "Cookie luôn nằm phía máy chủ, được gửi đi kiểm tra và không bao giờ lộ ra trình duyệt. Người dùng chỉ nhận liên kết Direct Login hợp lệ.",
  receiveGuestRule:
    "Khách nhận một token mỗi yêu cầu, tối đa theo hạn mức IP mỗi ngày.",
  receiveAdminRule:
    "Quản trị viên có thể yêu cầu lô từ 1–20 token và không bị áp dụng hạn mức khách.",
  receiveQuantity: "Số lượng token",
  receiveQuantityHelp: "Nhập số nguyên từ 1 đến 20.",
  receiveGuestSingle: "Chế độ khách luôn yêu cầu một token.",
  receiveAdminBatch: "CHẾ ĐỘ LÔ ADMIN",
  receiveButton: "NHẬN TOKEN",
  receiveButtonMany: "NHẬN NHIỀU TOKEN",
  receiveLoading: "ĐANG KIỂM TRA KHO...",
  receiveResultTitle: "Token đã nhận",
  receiveResultEyebrow: "Direct Login // Riêng tư",
  receiveEmpty: "CHƯA CÓ TOKEN ĐƯỢC CẤP",
  receiveEmptyDetail:
    "Bắt đầu yêu cầu để nhận liên kết Direct Login đã được xác minh từ kho Redis.",
  receiveSummary: "Đã cấp {delivered} trên {requested} token được yêu cầu.",
  receiveTokenItem: "TOKEN {index}",
  receiveCopyAll: "SAO CHÉP TẤT CẢ",
  receiveCopiedAll: "ĐÃ SAO CHÉP TẤT CẢ",
  navOverview: "Tổng quan",
  navRedis: "Redis",
  navSettings: "Cài đặt",
  navOperator: "NGƯỜI VẬN HÀNH",
  navElevated: "Phiên quản trị đang hoạt động",
  navAria: "Điều hướng quản trị",
  navLogout: "ĐĂNG XUẤT",
  adminControlCenter: "TRUNG TÂM ĐIỀU KHIỂN",
  adminPrivileged: "CHẾ ĐỘ QUẢN TRỊ",
  loginTitle: "Đăng nhập quản trị",
  loginGuestDeck: "Trang khách",
  loginPanelTitle: "Truy cập quản trị",
  loginPanelEyebrow: "Khu vực giới hạn // Cấp 8",
  loginIdentity: "XÁC MINH DANH TÍNH",
  loginDescription:
    "Đăng nhập để truy cập Redis và các điều khiển hệ thống được bảo vệ.",
  loginConfigMissing:
    "Đăng nhập quản trị đang bị khóa vì chưa cấu hình đủ ADMIN_USERNAME, ADMIN_PASSWORD_HASH và AUTH_SECRET.",
  loginUsername: "Tên đăng nhập",
  loginPassword: "Mật khẩu",
  loginHidePassword: "Ẩn mật khẩu",
  loginShowPassword: "Hiện mật khẩu",
  loginFailed: "Đăng nhập thất bại.",
  loginRetry: "Đăng nhập thất bại. Vui lòng thử lại.",
  loginLoading: "ĐANG XÁC THỰC...",
  loginSubmit: "VÀO TRUNG TÂM ĐIỀU KHIỂN",
  loginHelp:
    "Có thể dùng trình quản lý mật khẩu hoặc dán trực tiếp. Nhập sai 5 lần sẽ bị khóa trong 15 phút.",
  overviewTitle: "TỔNG QUAN HỆ THỐNG",
  overviewDescription:
    "Dữ liệu trực tiếp, hoạt động của khách và trạng thái các dịch vụ được bảo vệ.",
  overviewTotalRequests: "Tổng yêu cầu",
  overviewAllChecks: "Tất cả lượt đã ghi nhận",
  overviewGuestQuota: "Hạn mức khách",
  overviewCreditsPerDay: "Lượt nhận Redis cho mỗi IP / ngày",
  overviewActiveQuota: "Field hạn mức đang dùng",
  overviewCurrentWindow: "Đã ghi nhận trong ngày",
  overviewAdminQuota: "Hạn mức quản trị",
  overviewExempt: "Không áp dụng giới hạn ứng dụng",
  overviewDistribution: "Phân bố tín hiệu",
  overviewOutcomes: "Tổng hợp kết quả phân tích",
  overviewAccessibleStatus:
    "Trạng thái sử dụng đồng thời chữ, biểu tượng và màu sắc để dễ nhận biết.",
  overviewHealth: "Tình trạng dịch vụ",
  overviewConnections: "Kết nối chỉ dành cho máy chủ",
  overviewRedisStore: "Kho Redis",
  overviewApiRuntime: "Máy chủ API",
  overviewHealthy: "ỔN ĐỊNH",
  overviewAuthGuard: "Bảo vệ đăng nhập",
  overviewActive: "HOẠT ĐỘNG",
  overviewFeed: "Dòng hoạt động",
  overviewNotices: "Thông báo hệ thống mới nhất",
  overviewQuotaEngine: "BỘ MÁY HẠN MỨC",
  overviewCreditsBody: "{limit} lượt nhận Redis mỗi ngày",
  overviewRedisMode: "CHẾ ĐỘ REDIS",
  overviewControlLink: "KẾT NỐI QUẢN TRỊ",
  overviewSessionVerified: "Phiên bảo vệ đã được xác minh",
  overviewTrafficEyebrow: "TRUY CẬP CÔNG KHAI // BẢO VỆ RIÊNG TƯ",
  overviewTrafficTitle: "Thống kê lượt truy cập",
  overviewTrafficDescription:
    "Lượt xem trang và số trình duyệt ước tính trên các trang công khai. Không tính quản trị viên và bot đã nhận diện.",
  overviewTrafficTodayViews: "Lượt xem hôm nay",
  overviewTrafficTodayViewsDetail:
    "Lượt tải và chuyển trang kể từ 00:00 giờ Việt Nam",
  overviewTrafficTodayVisitors: "Khách ước tính hôm nay",
  overviewTrafficTodayVisitorsDetail:
    "Dựa trên cookie trình duyệt ẩn danh, không phải số người tuyệt đối",
  overviewTrafficActive: "Hoạt động trong 5 phút",
  overviewTrafficActiveDetail:
    "Trình duyệt đã tải trang được theo dõi trong 5 phút gần nhất",
  overviewTrafficTotal: "Tổng lượt xem trang",
  overviewTrafficTotalDetail: "Được ghi nhận từ lúc bật thống kê truy cập",
  overviewTrafficTrend: "Truy cập 7 ngày",
  overviewTrafficTrendDetail: "Lượt xem và trình duyệt ước tính theo ngày",
  overviewTrafficDay: "Ngày",
  overviewTrafficPageViews: "Mức lượt xem",
  overviewTrafficCount: "Lượt",
  overviewTrafficVisitorsShort: "Khách",
  overviewTrafficTopPages: "Trang công khai nổi bật",
  overviewTrafficTopPagesDetail: "Lượt xem trong 7 ngày gần nhất",
  overviewTrafficHomePage: "Check thủ công",
  overviewTrafficReceivePage: "Nhận token",
  overviewTrafficLoginPage: "Đăng nhập quản trị",
  overviewTrafficPrivacy:
    "Không lưu IP gốc, cookie nhập vào hay token tài khoản. ID ẩn danh và khóa giới hạn IP đều được băm một chiều.",
  settingsTitle: "CÀI ĐẶT HỆ THỐNG",
  settingsDescription:
    "Điều chỉnh lượt nhận Redis; check thủ công luôn không giới hạn và quản trị viên được miễn hạn mức khách.",
  settingsGuestQuota: "Hạn mức nhận của khách",
  settingsRuntime: "Cấu hình đang áp dụng",
  settingsAdminPolicy: "Chính sách quản trị",
  settingsPermissions: "Quyền theo vai trò",
  settingsUnlimited: "KHÔNG GIỚI HẠN",
  settingsExempt: "Nhận Redis và check thủ công không giới hạn",
  settingsAdminLimits:
    "Kiểm tra dữ liệu đầu vào và giới hạn của nhà cung cấp vẫn áp dụng cho quản trị viên.",
  settingsSecurityRules: "Quy tắc bảo mật",
  settingsServerEnforced: "Thực thi tại máy chủ",
  settingsCookieRule: "Cookie phiên dùng HttpOnly, Secure và SameSite",
  settingsExpiryRule: "Phiên tự hết hạn sau 8 giờ",
  settingsRoleRule: "Mọi API quản trị đều xác minh vai trò tại máy chủ",
  quotaLabel: "LƯỢT NHẬN REDIS / IP / NGÀY",
  quotaValidHelp: "Cho phép từ 1–100 lượt. Đặt lại lúc 00:00 giờ Việt Nam.",
  quotaInvalidHelp: "Vui lòng nhập số nguyên từ 1 đến 100.",
  quotaSaveFailed: "Không thể lưu hạn mức.",
  quotaSaved:
    "Đã cập nhật hạn mức nhận của khách. Yêu cầu Redis mới sẽ áp dụng ngay.",
  quotaSaving: "ĐANG LƯU...",
  quotaSave: "LƯU HẠN MỨC",
  announcementSettingsTitle: "Popup thông báo cho khách",
  announcementSettingsEyebrow: "Bản tin có thể chỉnh sửa // Chỉ dành cho khách",
  announcementEnabled: "HIỆN POPUP CHO KHÁCH",
  announcementEnabledHelp:
    "Mở mỗi khi truy cập hoặc tải lại trang. Quản trị viên đã đăng nhập sẽ không thấy.",
  announcementIconLabel: "ICON THÔNG BÁO",
  announcementIcon_megaphone: "Loa thông báo",
  announcementIcon_info: "Thông tin",
  announcementIcon_gift: "Quà tặng",
  announcementIcon_shield: "Khiên bảo vệ",
  announcementIcon_link: "Liên kết",
  announcementVietnamese: "NỘI DUNG TIẾNG VIỆT",
  announcementEnglish: "NỘI DUNG TIẾNG ANH",
  announcementTitleLabel: "TIÊU ĐỀ",
  announcementMessageLabel: "NỘI DUNG",
  announcementLinkLabel: "NHÃN NÚT LIÊN KẾT",
  announcementLinkSection: "LIÊN KẾT ĐÍCH KHÔNG BẮT BUỘC",
  announcementLinkUrl: "ĐƯỜNG DẪN",
  announcementLinkHelp:
    "Để trống nếu không cần link. Chấp nhận /duong-dan-noi-bo hoặc URL http(s).",
  announcementLinkInvalid:
    "Hãy nhập đường dẫn nội bộ an toàn hoặc URL http(s) đầy đủ.",
  announcementNewTab: "Mở liên kết trong tab mới",
  announcementInvalid:
    "Hãy điền đủ hai ngôn ngữ. Nếu có URL, cần nhãn nút cho cả hai ngôn ngữ và URL an toàn.",
  announcementStorageHelp:
    "Lưu tại Redis: pixel_press → cau_hinh:thong_bao_popup",
  announcementSaveFailed: "Không thể lưu thông báo.",
  announcementSaved:
    "Đã cập nhật thông báo. Khách sẽ thấy nội dung mới ở lần truy cập trang tiếp theo.",
  announcementSaving: "ĐANG LƯU...",
  announcementSave: "LƯU THÔNG BÁO",
  redisTitle: "QUẢN LÝ REDIS",
  redisDescription:
    "Dữ liệu ứng dụng được gom trong một hash; giá trị nhạy cảm không được gửi ra trình duyệt.",
  redisConnection: "KẾT NỐI",
  redisGroups: "NHÓM DỮ LIỆU",
  redisValues: "GIÁ TRỊ",
  redisMasked: "ĐÃ ẨN",
  redisInventory: "Danh mục dữ liệu",
  redisInventoryEyebrow: "Chỉ hiển thị số lượng // Không lộ giá trị",
  redisField: "KEY / FIELD",
  redisCount: "SỐ LƯỢNG",
  redisClass: "PHÂN LOẠI",
  redisProtected: "BẢO VỆ",
  redisManaged: "QUẢN LÝ",
  redisMaintenance: "Khu bảo trì",
  redisDestructive: "Các thao tác xóa dữ liệu",
  redisDefinitions: "Định nghĩa dữ liệu",
  redisOneHash: "Một hash duy nhất cho dữ liệu mới",
  redisProtectedDetail:
    "Được bảo vệ khỏi xóa hàng loạt; máy phát giữ cookie LIVE và UNKNOWN, chỉ xóa cookie DIE không hợp lệ.",
  redisRootDetail: "Redis Hash duy nhất chứa toàn bộ dữ liệu do ứng dụng tạo.",
  redisConfigDetail:
    "Số lượt nhận Redis tối đa của mỗi IP khách trong một ngày.",
  redisAnnouncementDetail:
    "Nội dung popup cho khách, icon và liên kết đích an toàn không bắt buộc.",
  redisStatsDetail: "Tổng lượt kiểm tra và số kết quả LIVE, DIE, UNKNOWN.",
  redisReceiveStatsDetail:
    "Số yêu cầu phát cookie, token đã cấp và cookie lỗi đã loại bỏ.",
  redisQuotaDetail:
    "Số lượt nhận Redis một IP khách đã dùng; field tự hết hạn sau khi sang ngày mới.",
  redisLoginDetail:
    "Số lần đăng nhập sai; tự hết hạn sau 15 phút và bị xóa khi đăng nhập đúng.",
  redisTrafficDetail:
    "Bộ đếm lượt xem ẩn danh, trình duyệt ước tính theo ngày, field chống ghi trùng và hoạt động ngắn hạn.",
  redisWarning:
    "Hai key gốc NetflixId và VN không thể bị xóa hàng loạt tại đây. Máy phát có thể tiêu thụ từng phần tử đã cấp hoặc không hợp lệ; bộ đếm ứng dụng nằm trong pixel_press.",
  redisConfirm:
    "Xóa toàn bộ field {pattern} trong pixel_press? Thao tác này không thể hoàn tác.",
  redisCleanupFailed: "Không thể xóa dữ liệu.",
  redisCleared: "Đã xóa {count} field thuộc {pattern}. Đang tải lại...",
  redisClearQuota: "XÓA HẠN MỨC",
  redisClearLogin: "XÓA KHÓA LOGIN",
  redisRefresh: "LÀM MỚI",
  apiWrongOrigin: "Yêu cầu bị từ chối do không đúng nguồn truy cập.",
  apiAuthNotConfigured: "Chưa cấu hình đầy đủ tài khoản quản trị.",
  apiTooManyAttempts:
    "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.",
  apiInvalidLoginData: "Dữ liệu đăng nhập không hợp lệ.",
  apiLoginRequired:
    "Vui lòng nhập tên đăng nhập và mật khẩu tối thiểu 12 ký tự.",
  apiBadCredentials: "Tên đăng nhập hoặc mật khẩu không đúng.",
  apiUnauthorized: "Bạn chưa đăng nhập hoặc phiên đã hết hạn.",
  apiInvalidRequest: "Dữ liệu yêu cầu không hợp lệ.",
  apiInvalidNamespace: "Nhóm dữ liệu này không được phép xóa.",
  apiInvalidLimit: "Hạn mức mỗi ngày phải là số nguyên từ 1 đến 100.",
  apiInvalidSettings:
    "Cấu hình không hợp lệ. Hãy kiểm tra nội dung bắt buộc và định dạng liên kết.",
  apiInvalidPayload: "Dữ liệu gửi lên không hợp lệ.",
  apiCookieLength:
    "Vui lòng nhập cookie đầy đủ, có độ dài từ 16 đến 16.000 ký tự.",
  apiVpnBlocked:
    "Khách không thể nhận từ Redis khi đang dùng VPN hoặc proxy. Check thủ công vẫn sử dụng được.",
  apiQuotaExhausted:
    "Bạn đã dùng hết lượt nhận Redis hôm nay. Hạn mức đặt lại sau 00:00 giờ Việt Nam; check thủ công vẫn không giới hạn.",
  apiReceiveQuantity: "Số lượng token phải là số nguyên từ 1 đến 20.",
  apiReceiveUnavailable:
    "Hiện chưa có cookie xác minh thành công. Lượt nhận không bị trừ; vui lòng thử lại sau.",
  apiReceiveSuccess: "Đã cấp token được xác minh thành công.",
  apiReceivePartial: "Kho hiện tại chỉ cấp được một phần số token đã yêu cầu.",
  apiReceiveFailed:
    "Máy phát token tạm thời không khả dụng. Lượt nhận không bị trừ.",
  apiCookieRecognized:
    "Đã nhận diện cấu trúc cookie nhưng chưa thể xác minh trạng thái tài khoản.",
  apiCookieFieldsMissing:
    "Không tìm thấy NetflixId hoặc SecureNetflixId. Vui lòng kiểm tra lại cookie.",
  apiCookieLive: "Cookie còn hoạt động và đã được xác minh thành công.",
  apiCookieDie: "Cookie không hợp lệ hoặc đã hết hạn.",
  apiCookieUnknown: "Dịch vụ xác minh chưa thể kết luận trạng thái cookie.",
  apiCookieAccepted:
    "Cookie còn hoạt động và đã được dịch vụ xác minh chấp nhận.",
  apiCookieRedirected:
    "Cookie không hợp lệ, đã hết hạn hoặc bị chuyển hướng về trang đăng nhập.",
  apiVerifierUnknown:
    "Dịch vụ xác minh trả về lỗi chưa xác định. Vui lòng thử lại sau.",
  apiVerifierInvalid:
    "Máy chủ xác minh không trả về kết quả hợp lệ. Vui lòng thử lại sau.",
  apiVerifierUnsupported: "Máy chủ xác minh trả về định dạng chưa được hỗ trợ.",
  apiVerifierTimeout:
    "Máy chủ xác minh quá thời gian chờ. Cookie không được lưu; vui lòng thử lại sau.",
  vpnNotConfigured: "Chưa cấu hình dịch vụ kiểm tra VPN",
  vpnUnavailable: "Dịch vụ kiểm tra VPN đang không khả dụng",
  vpnDetected: "Đã phát hiện VPN hoặc proxy",
  vpnDirect: "Kết nối mạng trực tiếp",
  vpnTimeout: "Kiểm tra VPN quá thời gian chờ",
};

export const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "vi";
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getRequestLocale(request: {
  cookies: { get: (name: string) => { value: string } | undefined };
}) {
  return normalizeLocale(request.cookies.get(LOCALE_COOKIE)?.value);
}

export function getRequestDictionary(request: {
  cookies: { get: (name: string) => { value: string } | undefined };
}) {
  return getDictionary(getRequestLocale(request));
}

export function formatMessage(
  message: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    message,
  );
}
