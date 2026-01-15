self.onmessage = (e) => {
  if (e.data.action === 'calculate') {
    calculatePi(e.data.data.iterations);
  }
};

function calculatePi(iterations) {
  let pi = 0;
  for (let i = 0; i < iterations; i++) {
    pi += Math.pow(-1, i) / (2 * i + 1);

    // 每 10000 次报告一次进度
    if (i % 10000 === 0) {
      const progress = Math.round((i / iterations) * 100);
      self.postMessage({ type: 'progress', value: progress });
    }
  }
  pi *= 4;
  self.postMessage(pi);
}