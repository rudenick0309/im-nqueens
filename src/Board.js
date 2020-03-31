// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {
  /* eslint-disable */
  window.Board = Backbone.Model.extend({
    initialize: function(params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log(
          "Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:"
        );
        console.log(
          "\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: grey;"
        );
        console.log(
          "\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: blue;",
          "color: black;",
          "color: grey;"
        );
      } else if (params.hasOwnProperty("n")) {
        this.set(makeEmptyMatrix(this.get("n")));
      } else {
        this.set("n", params.length);
      }
    },

    // 체스 판의 모든 행 배열을 반환합니다.
    // 결과적으로 2차원 배열 형태의 체스 판이 반환됩니다.
    // ex)
    // [
    //  [1,0,0,0],
    //  [0,0,0,0],
    //  [0,0,0,0],
    //  [0,0,0,0]
    // ]
    rows: function() {
      return _(_.range(this.get("n"))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    // 특정 좌표에 말이 없으면 올리고, 이미 있으면 내립니다.
    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      this.trigger("change");
    },

    // 특정 좌표가 주어졌을 때, 해당 좌표를 지나는 주대각선의 첫 번째 행 컬럼을 반환합니다.
    // ex) rowIndex: 1, colIndex: 0이 주어졌을 때 -1 반환
    //          -1 0 1 2 3 4
    // ----------------------
    //       0   1[0,0,0,0]
    //       1    [1,0,0,0]
    //       2    [0,1,0,0]
    //       3    [0,0,1,0]
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    // 특정 좌표가 주어졌을 때, 해당 좌표를 지나는 반대각선의 첫 번째 행 컬럼을 반환합니다.
    // ex) rowIndex: 1, colIndex: 3이 주어졌을 때 4 반환
    //          -1 0 1 2 3 4
    // ----------------------
    //       0    [0,0,0,0]1
    //       1    [0,0,0,1]
    //       2    [0,0,1,0]
    //       3    [0,1,0,0]
    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    // 체스 판 위에 서로 공격할 수 있는 룩이 한 쌍이라도 있는지 검사합니다.
    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    // 체스 판 위에 서로 공격할 수 있는 퀸이 한 쌍이라도 있는지 검사합니다.
    hasAnyQueensConflicts: function() {
      return (
        this.hasAnyRooksConflicts() ||
        this.hasAnyMajorDiagonalConflicts() ||
        this.hasAnyMinorDiagonalConflicts()
      );
    },

    // 체스 판 위 특정 좌표를 기준으로, 서로 공격할 수 있는 퀸이 한 쌍이라도 있는지 검사합니다. (가로, 세로, 주대각선, 반대각선)
    // 이 함수는 BorderView.js 파일에서 브라우저에 체스판을 그려주기 위해 사용합니다.
    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)
        ) ||
        this.hasMinorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex)
        )
      );
    },

    // 주어진 좌표가 체스 판에 포함되는 좌표인지 확인합니다.
    _isInBounds: function(rowIndex, colIndex) {
      return (
        rowIndex >= 0 &&
        rowIndex < this.get("n") &&
        colIndex >= 0 &&
        colIndex < this.get("n")
      );
    },
    /* eslint-enable */

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /* =========================================================================
    =                 TODO: fill in these Helper Functions                    =
    ========================================================================= */

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //

    // recursion(재귀)에 대해 익숙한 활용능력, 스킬

    // DFS(깊이 우선 탐색): Stack 구조를 활용
    // - 사용하는 경우: 모든 노드를 탐색하고자 하는 경우에 사용한다

    // BFS(너비 우선 탐색): Queue를 사용한다. / 선입선출 원칙으로 탐색
    // 시작 정점에서 가까운 정점을 먼저 방문, 멀리 있는 정점은 나중에 방문하는 순회방법
    // 즉, 깊게 탐색하기 전에 넓게 탐색하는 방법
    // 직관적이지 않다 / 재귀적으로 동작하지 않는다
    // 시작노드에서 시작하여 거리에 따라 단계별로 탐색

    // Backtracking: 모든 조합의 수를 살펴보는 것인데 단 조건이 만족할 때 만이다
    // (조건이 만족하는 경우라는 조건 때문에 경우에 따라 훨씬 빠를 수 있다)
    // 개념 링크: https://medium.com/@jeongdowon/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-backtracking-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-13492b18bfa1
    // 관련 코드 예시: https://github.com/DeekshaPrabhakar/JavaScript/wiki/Backtracking

    // 주어진 행(rowIndex)에 충돌하는 말이 있는지 확인합니다.
    // 1. 어떠한 행에 부딪히는 말이 있는지 확인
    hasRowConflictAt: function(rowIndex) {
      let row = this.attributes[rowIndex];
      // console.log(1, this);
      // console.log(11, row);
      // console.log(2, this.attributes);

      let count = 0;
      for (let i = 0; i < row.length; i++) {
        count += row[i];
      }
      if (count > 1) {
        return true;
      } else {
        return false;
      }
    },

    // 체스 판 위에 행 충돌이 하나라도 있는지 검사합니다.
    // 2. 체스판 전체 행에 부딪히는 말이 있는지 확인
    hasAnyRowConflicts: function() {
      for (let i = 0; i < this.get("n"); i += 1) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // 주어진 열(colIndex)에 충돌하는 말이 있는지 확인합니다.
    // 3. 어떠한 열에 부딪히는 말이 있는지 확인
    hasColConflictAt: function(colIndex) {
      console.log(12, colIndex);
      let col = this.attributes;
      let count = 0;
      console.log("what ", col.n);
      for (let i = 0; i < col.n; i += 1) {
        console.log("22", i, colIndex);
        count += col[i][colIndex];
      }
      if (count > 1) {
        return true;
      } else {
        return false;
      }
    },

    // 체스 판 위에 열 충돌이 하나라도 있는지 검사합니다.
    // 4. 체스판 전체 열에 부딪히는 말이 있는지 확인
    hasAnyColConflicts: function() {
      for (let i = 0; i < this.get("n"); i += 1) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
      // return false; // fixme
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // 주어진 주대각선에 충돌하는 말이 있는지 확인합니다.
    /*
     * 5. 어떠한 위치가 주어졌을 때 좌측 위로 올라가다보면,
     * 왼쪽상단에서 우측하단쪽으로 내려오는 대각선의 머리가 나온다,
     * 그 머리가 포함된 대각선의 말이 부딪히는가 확인하는 함수
     */
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // console.log(majorDiagonalColumnIndexAtFirstRow);
      return false; // fixme
    },

    // 체스 판 위에 주대각선 충돌이 하나라도 있는지 검사합니다.
    /*
     * 6. 체스판 내의 모든 대각선을 좌측상단에서 우측 하단으로 내려오는
     * 방향으로 검사했을 때 겹치는 말이 있는지 확인하는 함수
     */
    hasAnyMajorDiagonalConflicts: function() {
      return false; // fixme
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // 주어진 반대각선에 충돌하는 말이 있는지 확인합니다.
    /*
     * 7. 특정 위치가 주어졌을 때 우측 위로 올라가다보면 오른쪽상단에서
     * 좌측하단쪽으로 내려오는 대각선의 머리가 나온다, 그 머리가 포함된
     * 대각선의 말이 겹치는가 확인하는 함수
     */
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // 체스 판 위에 반대각선 충돌이 하나라도 있는지 검사합니다.
    /*
     * 8. 체스판 내의 모든 대각선을 우측상단에서 좌측 하단으로 내려오는
     * 방향으로 검사했을 때 겹치는 말이 있는지 확인하는 함수
     */
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /* --------------------  End of Helper Functions  --------------------- */
  });
  /* eslint-disable */
  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };
  /* eslint-enable */
})(); /*
    return function (graph, start, goal) {
      return hasPath(graph, start, goal);
    };
  }());
  exports.dfs = dfs;
}(typeof exports === 'undefined' ? window : exports));*/

// 그래프 탐색이란?
// 하나의 정점으로부터 시작해서 차례대로 모든 정점들을 하나씩 방문하는 것(ex: 특정 도시에서 다른 도시로 갈 수 있는지 없는지)

// 깊이 우선 탐색이란?(DFS)
// 루트(root)노드에서 혹은 다른 임의의 노드에서 시작해서 다음분기(branch)fh 넘어가기 전에 해당 분기를 완벽하게 탐색하는 방법
// - 미로를 탐색할 때 한길로 쭉 가다가 막혔을 때, 가장 가까운 길로 돌아와 그곳에서 다른길로 다시 탐색하는 방법
// - 사용하는 경우: 모든 노드를 탐색하고자 하는 경우에 사용한다

// 깊이 우선 탐색의 특징
// 1. 자기 자신을 호출하는 순환 형태의 알고리즘 형태를 가지고 있다
// 2. 이 알고리즘을 구현할 때 가장 큰 차이점은, 어떤 노드를 방문했었는지의 여부를 반드시 검사해야 한다
// 3. 이를 검사하지 않을 경우 무한 루프에 빠질 위험이 있다

// ========================================================================================
// 깊이 우선 탐색의 구현
// 구현 방법 2가지
// 1. 순환 호출 이용
// 2. 명시적인 스택사용(Last in First Out) - 명시적인 스택을 사용하여 방문한 정점들을 스택에 저장하였다가 다시 꺼내어 작업한다.
// 3. 순환 호출을 이용한 DFS의 의사코드(pseodo code)
/*
(function (exports) {
  'use strict';
  var dfs = (function () {
    function hasPath(graph, current, goal) {
      var stack = [];
      var visited = [];
      var node;
      stack.push(current);
      visited[current] = true;
      while (stack.length) {
        node = stack.pop();
        if (node === goal) {
          return true;
        }
        for (var i = 0; i < graph[node].length; i += 1) {
          if (graph[node][i] && !visited[i]) {
            stack.push(i);
            visited[i] = true;
          }
        }
      }
      return false;
    } */
/*
 * Depth-First graph searching algorithm.
 * Returns whether there's a path between two nodes in a graph.<br><br>
 * Time complexity: O(|V|^2).
 *
 * @module graphs/searching/dfs
 * @public
 * @param {Array} graph Adjacency matrix, which represents the graph.
 * @param {Number} start Start node.
 * @param {Number} goal Target node.
 * @return {Boolean} Returns true if path between two nodes exists.
 *
 * @example
 * var dfs = require('../src/graphs/searching/dfs').dfs;
 * var graph = [[1, 1, 0, 0, 1, 0],
 *              [1, 0, 1, 0, 1, 0],
 *              [0, 1, 0, 1, 0, 0],
 *              [0, 0, 1, 0, 1, 1],
 *              [1, 1, 0, 1, 0, 0],
 *              [0, 0, 0, 1, 0, 0]];
 * var pathExists = dfs(graph, 1, 5); // true
 */
// ========================================================================================

// 깊이 우선 탐색(DFS)의 시간 복잡도
// 1. DFS는 그래프(정점의 수: N, 간선의 수: E)의 모든 간선을 조회한다.
