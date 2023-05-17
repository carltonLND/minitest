import chalk from "chalk";

function logPass() {
  console.log(chalk.green("\tPassed!"));
  return true;
}

function logFail(actual, expected) {
  console.log(chalk.red("\tFailed..."));

  if (actual !== undefined && expected !== undefined) {
    console.log(chalk.yellow("\t\tActual:  ", actual));
    console.log(chalk.yellow("\t\tExpected:", expected));
    return false;
  }
}

function assertIsObject(actual, expected) {
  if (typeof actual === "object" || typeof expected === "object") {
    return true;
  }

  console.log(chalk.red("\tERROR..."));
  console.log(chalk.yellow("\t\tMust compare only objects or arrays!"));
  return false;
}

function compareArrays(array1, array2) {
  // Dont need to compare if they have the same reference
  if (Object.is(array1, array2)) {
    return true;
  }

  // Attempt to deal with nested arrays
  const flattenedArray1 = array1.flat(Infinity);
  const flattenedArray2 = array2.flat(Infinity);

  // A different length is obviously not equal, saves time
  if (flattenedArray1.length !== flattenedArray2.length) {
    return false;
  }

  return flattenedArray1.every((value, index) => {
    // Not sure the best way to deal with nested objects
    // Without creating a circular dependency just yet
    // This only works because JavaScript "hoists" functions
    if (typeof value === "object") {
      return compareObjects(value, flattenedArray2[index]);
    }

    return value === flattenedArray2[index];
  });
}

function compareObjects(object1, object2) {
  // Dont need to compare if they have the same reference
  if (Object.is(object1, object2)) {
    return true;
  }

  const keysEqual = compareArrays(Object.keys(object1), Object.keys(object2));
  const valuesEqual = compareArrays(
    Object.values(object1),
    Object.values(object2)
  );

  if (keysEqual && valuesEqual) {
    return true;
  }

  return false;
}

/** Returns true if given values are equal, using === */
export function isEqual(actual, expected, label) {
  console.log("Is Equal?", chalk.blue(label ?? ""));

  if (actual === expected) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

export function isNotEqual(actual, expected, label) {
  console.log("Is Not Equal?", chalk.blue(label ?? ""));

  if (actual !== expected) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

export function isMatchingArray(actual, expected, label) {
  console.log("Is Matching?", chalk.blue(label ?? ""));

  if (compareArrays(actual, expected)) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

export function isNotMatchingArray(actual, expected, label) {
  console.log("Is Matching?", chalk.blue(label ?? ""));

  if (!compareArrays(actual, expected)) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

export function isMatchingObject(actual, expected, label) {
  console.log("Is Matching?", chalk.blue(label ?? ""));

  if (compareObjects(actual, expected)) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

export function isNotMatchingObject(actual, expected, label) {
  console.log("Is Matching?", chalk.blue(label ?? ""));

  if (compareObjects(actual, expected)) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

/** Returns true if given objects/arrays have the same reference */
export function isSameObject(actual, expected, label) {
  console.log("Is Same?", chalk.blue(label ?? ""));

  if (!assertIsObject(actual, expected)) {
    return false;
  }

  if (Object.is(actual, expected)) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

export function isNotSameObject(actual, expected, label) {
  console.log("Is Not Same?", chalk.blue(label ?? ""));

  if (!assertIsObject(actual, expected)) {
    return false;
  }

  if (!Object.is(actual, expected)) {
    return logPass();
  } else {
    return logFail(actual, expected);
  }
}

export function help() {
  console.log(
    "Functions:",
    Object.keys(this),
    `\n\r----- Params:
    \rexport function *(function call, expected result, optional label)
    \r-----\n`
  );
}
