const copyText = async (text) => {
  if (!text) {
    throw new Error("没有可复制的内容");
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      console.warn("剪贴板 API 不可用，尝试兼容复制", error);
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("浏览器未允许复制");
  }
};

const setButtonState = (button, text, className) => {
  if (!button) {
    return;
  }

  button.textContent = text;
  button.classList.remove("is-success", "is-error");

  if (className) {
    button.classList.add(className);
  }
};

document.querySelectorAll("pre").forEach((pre) => {
  const code = pre.querySelector("code");

  if (!code || pre.parentElement?.classList.contains("code-block")) {
    return;
  }

  const wrapper = document.createElement("div");
  const button = document.createElement("button");

  wrapper.className = "code-block";
  button.className = "copy-code-button";
  button.type = "button";
  button.textContent = "复制";
  button.title = "复制这段代码";
  button.setAttribute("aria-label", "复制这段代码");

  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);
  wrapper.appendChild(button);

  button.addEventListener("click", async () => {
    try {
      await copyText(code.textContent?.trim() || "");
      setButtonState(button, "已复制", "is-success");
    } catch (error) {
      setButtonState(button, "复制失败", "is-error");
      console.error("复制 SQL 失败", error);
    }

    window.setTimeout(() => {
      setButtonState(button, "复制", "");
    }, 1600);
  });
});
