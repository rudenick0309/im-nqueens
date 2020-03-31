/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

//  n이 주어졌을 때 n rooks 문제의 해답 한 개를 반환합니다.
//  반환 값은 체스 판을 나타내는 2차원 배열입니다.

// 보드js 에서 , 넘어온	값, false - count를 안해

window.findNRooksSolution = function(n) {
  // 가로, 세로의 함수만 사용
  var solution = undefined; // fixme

  console.log("Single solution for " + n + " rooks:", JSON.stringify(solution));
  return solution;
};

// n이 주어졌을 때 n rooks 문제의 전체 해답 개수를 반환합니다.
// 반환 값은 정수입니다.
window.countNRooksSolutions = function(n) {
  // 가로, 세로의 함수만 사용
  var solutionCount = undefined; // fixme

  console.log("Number of solutions for " + n + " rooks:", solutionCount);
  return solutionCount;
};

// n이 주어졌을 때 n queens 문제의 해답 한 개를 반환합니다.
// 반환 값은 체스 판을 나타내는 2차원 배열입니다.
window.findNQueensSolution = function(n) {
  // 가로, 세로 대각선의 함수만 사용
  var solution = undefined; // fixme

  console.log(
    "Single solution for " + n + " queens:",
    JSON.stringify(solution)
  );
  return solution;
};

// n이 주어졌을 때 n queens 문제의 전체 해답 개수를 반환합니다.
// 반환 값은 정수입니다.
window.countNQueensSolutions = function(n) {
  // 가로, 세로 대각선의 함수만 사용
  var solutionCount = undefined; // fixme

  console.log("Number of solutions for " + n + " queens:", solutionCount);
  return solutionCount;
};
