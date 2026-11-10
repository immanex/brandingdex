const form = document.querySelector("#scorecard");
const dataElement = document.querySelector("#scorecard-data");

if (form && dataElement) {
  let scoreData;
  try {
    scoreData = JSON.parse(dataElement.textContent);
  } catch {
    scoreData = null;
  }

  if (scoreData) {
    const questions = [...form.querySelectorAll("[data-score-question]")];
    const total = questions.length;
    const progressText = form.querySelector("#score-progress");
    const progressBar = form.querySelector(".score-progress-track");
    const error = form.querySelector("#score-missing");
    const result = document.querySelector("#score-result");
    const reset = document.querySelector("#score-reset");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateProgress = () => {
      const answered = questions.filter(question => question.querySelector("input:checked")).length;
      const percent = total ? Math.round((answered / total) * 100) : 0;
      progressText.textContent = `${answered} of ${total} answered`;
      progressBar.setAttribute("aria-valuenow", String(answered));
      progressBar.style.setProperty("--score-progress", `${percent}%`);
      return answered;
    };

    const addAreaScore = (area, score, maxScore, percent) => {
      const row = document.createElement("div");
      row.className = "score-bar";

      const heading = document.createElement("div");
      heading.className = "score-bar-heading";
      const name = document.createElement("span");
      name.textContent = area.name;
      const value = document.createElement("strong");
      value.textContent = `${score} / ${maxScore}`;
      heading.append(name, value);

      const track = document.createElement("div");
      track.className = "score-bar-track";
      track.setAttribute("role", "meter");
      track.setAttribute("aria-label", `${area.name} score`);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(maxScore));
      track.setAttribute("aria-valuenow", String(score));
      const fill = document.createElement("span");
      fill.style.width = `${percent}%`;
      track.append(fill);
      row.append(heading, track);
      return row;
    };

    const showResult = () => {
      const selected = [...form.querySelectorAll("input[type=radio]:checked")];
      const maxAnswer = Number(scoreData.max) || 2;
      const maxScore = total * maxAnswer;
      const score = selected.reduce((sum, input) => sum + Number(input.value || 0), 0);
      const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
      const band = [...(scoreData.bands || [])]
        .sort((a, b) => Number(b.min) - Number(a.min))
        .find(item => percent >= Number(item.min));

      document.querySelector("#score-value").textContent = String(percent);
      document.querySelector("#score-title").textContent = band?.title || "Your brand is taking shape.";
      document.querySelector("#score-text").textContent = band?.text || "You have a useful starting point. Review the area scores to choose your next step.";

      const areaResults = (scoreData.areas || []).map(area => {
        const areaScore = selected
          .filter(input => input.dataset.area === area.id)
          .reduce((sum, input) => sum + Number(input.value || 0), 0);
        const areaMax = Number(area.questions) * maxAnswer;
        const areaPercent = areaMax ? Math.round((areaScore / areaMax) * 100) : 0;
        return { ...area, score: areaScore, maxScore: areaMax, percent: areaPercent };
      });

      const bars = document.querySelector("#score-bars");
      bars.replaceChildren(...areaResults.map(area => addAreaScore(area, area.score, area.maxScore, area.percent)));

      const focus = areaResults.reduce((lowest, area) => area.percent < lowest.percent ? area : lowest, areaResults[0]);
      if (focus) {
        const link = document.querySelector("#score-focus-link");
        const strongAcrossAreas = areaResults.every(area => area.percent === 100);
        document.querySelector("#score-focus-title").textContent = strongAcrossAreas ? "Keep it consistent." : focus.name;
        document.querySelector("#score-focus-text").textContent = strongAcrossAreas
          ? "Your brand is scoring strongly across the board. Keep your strategy, identity, website, and everyday materials aligned as the business grows."
          : focus.advice;
        link.href = strongAcrossAreas ? "/services/creative-partner/" : focus.link;
        link.textContent = strongAcrossAreas ? "Explore ongoing design support" : focus.linkLabel;
      }

      form.hidden = true;
      result.hidden = false;
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    };

    form.addEventListener("change", () => {
      const answered = updateProgress();
      if (answered === total) error.hidden = true;
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      if (updateProgress() !== total) {
        error.textContent = `Please answer all ${total} questions to see your score.`;
        error.hidden = false;
        const firstUnanswered = questions.find(question => !question.querySelector("input:checked"));
        const firstInput = firstUnanswered?.querySelector("input");
        firstInput?.focus({ preventScroll: true });
        firstUnanswered?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
        return;
      }
      error.hidden = true;
      showResult();
    });

    reset?.addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      result.hidden = true;
      error.hidden = true;
      updateProgress();
      form.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      questions[0]?.querySelector("input")?.focus({ preventScroll: true });
    });

    updateProgress();
  }
}
