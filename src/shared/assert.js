export function invariant(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

export function requireStringType(value, name) {
    invariant(typeof value === "string", `${name} must be a string`);
    return value;
}

export function requireNonEmpty(value, name) {
    const trimmed = value.trim();
    invariant(trimmed.length > 0, `${name} is required`);
    return trimmed;
}

export function requireString(value, name) {
    const asString = requireStringType(value, name);
    return requireNonEmpty(asString, name);
}

export function requireNumericString(value, name) {
    const trimmed = requireString(value, name);
    invariant(/^\d+$/.test(trimmed), `${name} must contain only digits`);
    return trimmed;
}