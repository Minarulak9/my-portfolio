// Recursion Examples Database
const RecursionExamples = {
    factorial: {
        name: "Factorial",
        code: `int factorial(int n) {
    // Base case: factorial of 0 or 1 is 1
    if (n <= 1) {
        return 1;
    }
    
    // Recursive case: n! = n * (n-1)!
    return n * factorial(n - 1);
}`,
        description: "Calculates the factorial of a number. The factorial of n (n!) is the product of all positive integers less than or equal to n.",
        parameters: [
            { name: 'n', type: 'number', default: 5, min: 0, max: 12, label: 'Number (n)' }
        ],
        complexity: {
            time: 'O(n)',
            space: 'O(n)'
        },
        explanation: {
            basic: {
                simple: "Factorial multiplies a number by all smaller numbers. For example, 5! = 5 × 4 × 3 × 2 × 1 = 120",
                baseCase: 'When n is 0 or 1, we stop and return 1',
                recursiveCase: 'Multiply n by the factorial of (n-1)',
                purpose: 'Learn how a function can call itself to break down a problem'
            },
            moderate: {
                baseCase: 'n <= 1 returns 1 (defines when to stop)',
                recursiveCase: 'n * factorial(n - 1) (calls itself with smaller input)',
                purpose: 'Demonstrates linear recursion where each call makes one recursive call'
            },
            deep: {
                baseCase: 'n <= 1 returns 1',
                recursiveCase: 'n * factorial(n - 1)',
                purpose: 'Each call multiplies the current number by the factorial of the previous number, building the result on the way back up the call stack'
            }
        },
        execute: function(n) {
            const calls = [];
            const stack = [];
            
            function factorial(n, depth = 0) {
                const callId = calls.length;
                const call = {
                    id: callId,
                    depth: depth,
                    params: { n: n },
                    type: 'call',
                    parentId: stack.length > 0 ? stack[stack.length - 1].id : null
                };
                
                calls.push(call);
                stack.push(call);
                
                let result;
                if (n <= 1) {
                    result = 1;
                    call.isBase = true;
                } else {
                    const subResult = factorial(n - 1, depth + 1);
                    result = n * subResult;
                }
                
                call.return = result;
                call.type = 'return';
                calls.push({ ...call, type: 'return' });
                stack.pop();
                
                return result;
            }
            
            const result = factorial(n);
            return { calls, result };
        }
    },
    
    fibonacci: {
        name: "Fibonacci",
        code: `int fibonacci(int n) {
    // Base cases
    if (n <= 0) {
        return 0;
    }
    if (n == 1) {
        return 1;
    }
    
    // Recursive case: fib(n) = fib(n-1) + fib(n-2)
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        description: "Calculates the nth Fibonacci number. Each number is the sum of the two preceding numbers.",
        parameters: [
            { name: 'n', type: 'number', default: 6, min: 0, max: 10, label: 'Position (n)' }
        ],
        complexity: {
            time: 'O(2^n)',
            space: 'O(n)'
        },
        explanation: {
            baseCase: 'n <= 0 returns 0, n == 1 returns 1',
            recursiveCase: 'fibonacci(n-1) + fibonacci(n-2)',
            purpose: 'Demonstrates exponential growth and tree recursion with overlapping subproblems'
        },
        execute: function(n) {
            const calls = [];
            const stack = [];
            let callCounter = 0;
            
            function fibonacci(n, depth = 0, parent = null) {
                const callId = callCounter++;
                const call = {
                    id: callId,
                    depth: depth,
                    params: { n: n },
                    type: 'call',
                    parentId: parent
                };
                
                calls.push(call);
                stack.push(call);
                
                let result;
                if (n <= 0) {
                    result = 0;
                    call.isBase = true;
                } else if (n === 1) {
                    result = 1;
                    call.isBase = true;
                } else {
                    const left = fibonacci(n - 1, depth + 1, callId);
                    const right = fibonacci(n - 2, depth + 1, callId);
                    result = left + right;
                }
                
                call.return = result;
                calls.push({ ...call, type: 'return' });
                stack.pop();
                
                return result;
            }
            
            const result = fibonacci(n);
            return { calls, result };
        }
    },
    
    tower: {
        name: "Tower of Hanoi",
        code: `void towerOfHanoi(int n, char from, char to, char aux) {
    // Base case: only one disk to move
    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", from, to);
        return;
    }
    
    // Move n-1 disks from 'from' to 'aux' using 'to'
    towerOfHanoi(n - 1, from, aux, to);
    
    // Move the nth disk from 'from' to 'to'
    printf("Move disk %d from %c to %c\\n", n, from, to);
    
    // Move n-1 disks from 'aux' to 'to' using 'from'
    towerOfHanoi(n - 1, aux, to, from);
}`,
        description: "Solves the Tower of Hanoi puzzle - move n disks from source to destination using an auxiliary peg.",
        parameters: [
            { name: 'n', type: 'number', default: 3, min: 1, max: 6, label: 'Number of Disks' }
        ],
        complexity: {
            time: 'O(2^n)',
            space: 'O(n)'
        },
        explanation: {
            baseCase: 'n == 1, move single disk directly',
            recursiveCase: 'Three recursive steps to move n disks',
            purpose: 'Classic divide-and-conquer problem showing how recursion elegantly solves complex puzzles'
        },
        execute: function(n) {
            const calls = [];
            const stack = [];
            let callCounter = 0;
            const moves = [];
            
            function towerOfHanoi(n, from, to, aux, depth = 0, parent = null) {
                const callId = callCounter++;
                const call = {
                    id: callId,
                    depth: depth,
                    params: { n, from, to, aux },
                    type: 'call',
                    parentId: parent
                };
                
                calls.push(call);
                stack.push(call);
                
                if (n === 1) {
                    moves.push(`Move disk 1 from ${from} to ${to}`);
                    call.isBase = true;
                } else {
                    towerOfHanoi(n - 1, from, aux, to, depth + 1, callId);
                    moves.push(`Move disk ${n} from ${from} to ${to}`);
                    towerOfHanoi(n - 1, aux, to, from, depth + 1, callId);
                }
                
                calls.push({ ...call, type: 'return' });
                stack.pop();
            }
            
            towerOfHanoi(n, 'A', 'C', 'B');
            return { calls, result: moves, moves };
        }
    },
    
    binary: {
        name: "Binary Search",
        code: `int binarySearch(int arr[], int left, int right, int target) {
    // Base case: element not found
    if (left > right) {
        return -1;
    }
    
    int mid = left + (right - left) / 2;
    
    // Base case: element found
    if (arr[mid] == target) {
        return mid;
    }
    
    // Recursive case: search in left or right half
    if (arr[mid] > target) {
        return binarySearch(arr, left, mid - 1, target);
    }
    return binarySearch(arr, mid + 1, right, target);
}`,
        description: "Searches for a target value in a sorted array by repeatedly dividing the search interval in half.",
        parameters: [
            { name: 'target', type: 'number', default: 7, min: 1, max: 20, label: 'Target Value' },
            { name: 'arraySize', type: 'number', default: 10, min: 5, max: 15, label: 'Array Size' }
        ],
        complexity: {
            time: 'O(log n)',
            space: 'O(log n)'
        },
        explanation: {
            baseCase: 'left > right (not found) or arr[mid] == target (found)',
            recursiveCase: 'Search in left or right half based on comparison',
            purpose: 'Demonstrates logarithmic recursion and divide-and-conquer strategy'
        },
        execute: function(target, arraySize = 10) {
            const arr = Array.from({ length: arraySize }, (_, i) => (i + 1) * 2);
            const calls = [];
            const stack = [];
            let callCounter = 0;
            
            function binarySearch(arr, left, right, target, depth = 0, parent = null) {
                const callId = callCounter++;
                const mid = Math.floor(left + (right - left) / 2);
                const call = {
                    id: callId,
                    depth: depth,
                    params: { left, right, mid, target, value: arr[mid] },
                    type: 'call',
                    parentId: parent,
                    array: [...arr]
                };
                
                calls.push(call);
                stack.push(call);
                
                let result;
                if (left > right) {
                    result = -1;
                    call.isBase = true;
                } else if (arr[mid] === target) {
                    result = mid;
                    call.isBase = true;
                    call.found = true;
                } else if (arr[mid] > target) {
                    result = binarySearch(arr, left, mid - 1, target, depth + 1, callId);
                } else {
                    result = binarySearch(arr, mid + 1, right, target, depth + 1, callId);
                }
                
                call.return = result;
                calls.push({ ...call, type: 'return' });
                stack.pop();
                
                return result;
            }
            
            const result = binarySearch(arr, 0, arr.length - 1, target);
            return { calls, result, array: arr };
        }
    },
    
    merge: {
        name: "Merge Sort",
        code: `void mergeSort(int arr[], int left, int right) {
    // Base case: array has one or zero elements
    if (left >= right) {
        return;
    }
    
    // Find the middle point
    int mid = left + (right - left) / 2;
    
    // Sort first and second halves
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    
    // Merge the sorted halves
    merge(arr, left, mid, right);
}`,
        description: "Sorts an array using divide-and-conquer approach by recursively dividing and merging.",
        parameters: [
            { name: 'arraySize', type: 'number', default: 8, min: 4, max: 12, label: 'Array Size' }
        ],
        complexity: {
            time: 'O(n log n)',
            space: 'O(n)'
        },
        explanation: {
            baseCase: 'left >= right (single element is sorted)',
            recursiveCase: 'Divide array, sort halves, merge them',
            purpose: 'Shows efficient divide-and-conquer sorting with guaranteed O(n log n) performance'
        },
        execute: function(arraySize = 8) {
            const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
            const calls = [];
            const stack = [];
            let callCounter = 0;
            
            function mergeSort(arr, left, right, depth = 0, parent = null) {
                const callId = callCounter++;
                const call = {
                    id: callId,
                    depth: depth,
                    params: { left, right, size: right - left + 1 },
                    type: 'call',
                    parentId: parent,
                    arraySegment: arr.slice(left, right + 1)
                };
                
                calls.push(call);
                stack.push(call);
                
                if (left >= right) {
                    call.isBase = true;
                } else {
                    const mid = Math.floor(left + (right - left) / 2);
                    mergeSort(arr, left, mid, depth + 1, callId);
                    mergeSort(arr, mid + 1, right, depth + 1, callId);
                    merge(arr, left, mid, right);
                    call.sorted = arr.slice(left, right + 1);
                }
                
                calls.push({ ...call, type: 'return' });
                stack.pop();
            }
            
            function merge(arr, left, mid, right) {
                const leftArr = arr.slice(left, mid + 1);
                const rightArr = arr.slice(mid + 1, right + 1);
                let i = 0, j = 0, k = left;
                
                while (i < leftArr.length && j < rightArr.length) {
                    if (leftArr[i] <= rightArr[j]) {
                        arr[k++] = leftArr[i++];
                    } else {
                        arr[k++] = rightArr[j++];
                    }
                }
                
                while (i < leftArr.length) arr[k++] = leftArr[i++];
                while (j < rightArr.length) arr[k++] = rightArr[j++];
            }
            
            const originalArr = [...arr];
            mergeSort(arr, 0, arr.length - 1);
            return { calls, result: arr, originalArray: originalArr };
        }
    },
    
    power: {
        name: "Power Function",
        code: `int power(int base, int exp) {
    // Base case: any number to power 0 is 1
    if (exp == 0) {
        return 1;
    }
    
    // Recursive case: base^exp = base * base^(exp-1)
    return base * power(base, exp - 1);
}`,
        description: "Calculates base raised to the power of exponent using recursion.",
        parameters: [
            { name: 'base', type: 'number', default: 2, min: 1, max: 10, label: 'Base' },
            { name: 'exp', type: 'number', default: 5, min: 0, max: 10, label: 'Exponent' }
        ],
        complexity: {
            time: 'O(n)',
            space: 'O(n)'
        },
        explanation: {
            baseCase: 'exp == 0 returns 1',
            recursiveCase: 'base * power(base, exp - 1)',
            purpose: 'Simple linear recursion demonstrating repeated multiplication'
        },
        execute: function(base, exp) {
            const calls = [];
            const stack = [];
            
            function power(base, exp, depth = 0) {
                const callId = calls.length;
                const call = {
                    id: callId,
                    depth: depth,
                    params: { base, exp },
                    type: 'call',
                    parentId: stack.length > 0 ? stack[stack.length - 1].id : null
                };
                
                calls.push(call);
                stack.push(call);
                
                let result;
                if (exp === 0) {
                    result = 1;
                    call.isBase = true;
                } else {
                    const subResult = power(base, exp - 1, depth + 1);
                    result = base * subResult;
                }
                
                call.return = result;
                calls.push({ ...call, type: 'return' });
                stack.pop();
                
                return result;
            }
            
            const result = power(base, exp);
            return { calls, result };
        }
    }
};