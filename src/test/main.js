function startWorker() {
  const worker = new Worker('worker.js');

  worker.postMessage({
    action: 'calculate',
    data: { iterations: 1000000 }
  });

  worker.onmessage = (e) => {
    if (e.data.type === 'progress') {
      document.getElementById('progress').textContent =
        `进度: ${e.data.value}%`;
    } else {
      document.getElementById('result').textContent =
        `结果: ${e.data}`;
      worker.terminate();
    }
  };
}