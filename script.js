// 순차적으로 전환될 안내 문구
const loadingMessages = [
    "입력하신 생년월일시의 기운을 정밀 분석 중입니다...",
    "2030 진로 및 대운의 흐름을 조합하고 있습니다...",
    "맞춤형 고민 솔루션을 도출하는 중입니다...",
    "거의 다 완성되었습니다. 예쁜 리포트로 정리하고 있습니다..."
  ];
  
  let messageIndex = 0;
  let messageInterval = null;
  
  async function generateReport() {
    const name = document.getElementById("name").value.trim();
    const birthDate = document.getElementById("birthDate").value.trim();
    const worry = document.getElementById("worry").value.trim();
  
    // 기본 입력값 검증
    if (!name || !birthDate) {
      alert("이름과 생년월일을 입력해 주세요.");
      return;
    }
  
    const submitBtn = document.getElementById("submit-btn");
    const loadingBox = document.getElementById("loading-box");
    const loadingText = document.getElementById("loading-text");
    const resultBox = document.getElementById("result-box");
  
    // 1. 화면 상태를 '로딩 중'으로 전환
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    resultBox.style.display = "none";
    resultBox.innerHTML = "";
    loadingBox.style.display = "block";
  
    messageIndex = 0;
    loadingText.innerText = loadingMessages[0];
  
    // 2. 3.5초 간격으로 안내 문구 변경
    messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      loadingText.innerText = loadingMessages[messageIndex];
    }, 3500);
  
    try {
      // 3. 실제 AI 분석 요청 (테스트용 3초 대기 시뮬레이션)
      // 실제 AI API 주소가 있다면 이 부분을 연동하세요.
      await new Promise(resolve => setTimeout(resolve, 3500));
  
      // 완성된 사주 리포트 내용 (예시)
      const sampleReportHtml = `
        <h3 style="color: #2c3e50; margin-bottom: 12px; border-bottom: 2px solid #4a90e2; padding-bottom: 6px;">
          📋 ${name}님의 2030 맞춤 사주 분석 리포트
        </h3>
        <p><strong>🔹 타고난 핵심 기운:</strong> 흔들리지 않는 뚝심과 섬세한 분석력을 동시에 가진 형태입니다.</p>
        <p><strong>🔹 현재 대운 및 진로 방향:</strong> 새로운 도전과 전문성 확장에 아주 유리한 흐름에 들어서 있습니다.</p>
        <p><strong>🔹 고민 맞춤 솔루션:</strong> 조급하게 결정하기보다는 본인의 강점을 문서화하고 체계화할 때 가장 큰 성과를 얻습니다.</p>
        <div style="margin-top: 15px; padding: 10px; background-color: #f0f7ff; border-radius: 6px; font-size: 13px; color: #2a6496;">
          💡 더 자세한 1:1 심층 상담이 필요하시면 언제든 오픈채팅으로 문의해 주세요!
        </div>
      `;
  
      // 4. 로딩 종료 및 결과 화면 표시
      clearInterval(messageInterval);
      loadingBox.style.display = "none";
      resultBox.innerHTML = sampleReportHtml;
      resultBox.style.display = "block";
  
    } catch (error) {
      clearInterval(messageInterval);
      loadingBox.style.display = "none";
      alert("분석 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }
  }