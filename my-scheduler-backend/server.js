// ================================================
// server.js  —  Express + Supabase + Gmail
// GitHub Actions가 매일 09:00 KST에 /api/run-daily 호출
// ================================================
require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const nodemailer = require("nodemailer");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase    = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const CRON_SECRET = process.env.CRON_SECRET || "change-me";

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

function getTodayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split("T")[0];
}

// ── 신청 등록 ──────────────────────────────────
app.post("/api/schedule", async (req, res) => {
  const { name, email, sendDate } = req.body;
  if (!name?.trim() || !email?.trim() || !sendDate)
    return res.status(400).json({ success: false, message: "모든 필드를 입력해주세요." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, message: "이메일 형식이 올바르지 않습니다." });
  if (sendDate <= getTodayKST())
    return res.status(400).json({ success: false, message: "내일 이후 날짜를 선택해주세요." });

  const { data, error } = await supabase
    .from("requests")
    .insert([{ name: name.trim(), email: email.trim(), send_date: sendDate, status: "pending" }])
    .select().single();

  if (error) return res.status(500).json({ success: false, message: "저장 오류가 발생했습니다." });
  res.json({ success: true, message: `${sendDate}에 이메일로 보내드립니다!`, id: data.id });
});

// ── GitHub Actions가 매일 호출 ─────────────────
app.post("/api/run-daily", async (req, res) => {
  if (req.headers["x-cron-secret"] !== CRON_SECRET)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const today = getTodayKST();
  const { data: targets = [] } = await supabase
    .from("requests").select("*").eq("send_date", today).eq("status", "pending");

  if (!targets.length)
    return res.json({ success: true, sent: 0, message: "오늘 발송 대상 없음" });

  const results = [];
  for (const r of targets) {
    let status = "sent", errorMsg = null;
    try {
      // ✅ 배포 후 실제 웹사이트 URL로 변경하세요
      const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:5173/#account";

      await mailer.sendMail({
        from: `"Sungmin & Jieun" <${process.env.EMAIL_USER}>`,
        to: r.email,
        subject: `💌 ${r.name}님, 요청하신 청첩장 리마인더입니다`,
        html: `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>청첩장 리마인더</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- 상단 장식 -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;color:#b8937a;font-weight:600;">WEDDING INVITATION</p>
            </td>
          </tr>

          <!-- 메인 카드 -->
          <tr>
            <td style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.08);">

              <!-- 상단 헤더 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2d2d2d 0%,#4a4a4a 100%);padding:48px 40px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.5);font-weight:600;">REMINDER</p>
                    <h1 style="margin:0 0 16px;font-size:32px;font-weight:300;color:#fff;letter-spacing:2px;">성민 ♥ 지은</h1>
                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);letter-spacing:1px;">우리의 결혼식에 초대합니다</p>
                  </td>
                </tr>
              </table>

              <!-- 본문 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px 40px 0;">

                    <!-- 인사말 -->
                    <p style="margin:0 0 8px;font-size:13px;color:#b8937a;font-weight:600;letter-spacing:1px;">안녕하세요,</p>
                    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#2d2d2d;">${r.name}님 💌</h2>
                    <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.9;">
                      요청하신 청첩장 리마인더 이메일을 보내드립니다.<br/>
                      저희 결혼식에 참석해 주신다면 더없는 기쁨이 될 것 같습니다.
                    </p>

                    <!-- 구분선 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="border-top:1px solid #f0ece8;"></td>
                        <td width="32" align="center">
                          <span style="font-size:16px;">✦</span>
                        </td>
                        <td style="border-top:1px solid #f0ece8;"></td>
                      </tr>
                    </table>

                    <!-- 안내 박스 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:#faf7f4;border-radius:14px;border-left:4px solid #b8937a;padding:24px 24px;">
                          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;color:#b8937a;">참석 안내</p>
                          <p style="margin:0;font-size:15px;color:#2d2d2d;line-height:1.8;font-weight:500;">
                            참석을 희망하신다면 아래 버튼을 눌러<br/>
                            청첩장 페이지에서 절차대로 진행해 주세요.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA 버튼 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                      <tr>
                        <td align="center">
                          <a href="${WEBSITE_URL}"
                            style="display:inline-block;background:linear-gradient(135deg,#2d2d2d,#4a4a4a);color:#fff;text-decoration:none;padding:16px 48px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.5px;box-shadow:0 4px 20px rgba(0,0,0,0.2);">
                            💌 &nbsp; 청첩장 보러가기
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- 하단 푸터 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#faf7f4;border-top:1px solid #f0ece8;padding:28px 40px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:13px;color:#2d2d2d;font-weight:600;">성민 & 지은</p>
                    <p style="margin:0;font-size:12px;color:#aaa;line-height:1.7;">
                      이 이메일은 ${r.name}님이 직접 요청하신 리마인더입니다.<br/>
                      문의사항이 있으시면 회신해 주세요.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 하단 카피 -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#c0b0a0;letter-spacing:1px;">© 2026 Sungmin & Jieun. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
      });
    } catch (e) { status = "failed"; errorMsg = e.message; }

    await supabase.from("sent_requests").insert([{
      id: r.id, name: r.name, email: r.email,
      send_date: r.send_date, sent_at: new Date().toISOString(),
      status, error_msg: errorMsg, created_at: r.created_at,
    }]);
    await supabase.from("requests").delete().eq("id", r.id);
    results.push({ email: r.email, status });
  }

  const sent   = results.filter(r => r.status === "sent").length;
  const failed = results.filter(r => r.status === "failed").length;
  res.json({ success: true, sent, failed, results });
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 4000, () =>
  console.log("🚀 서버 실행 | /api/run-daily 는 GitHub Actions가 매일 09:00 KST 호출")
);
