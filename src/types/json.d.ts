// JSON Types
export type JSONValue = null | string | boolean | number | JSONValue[] | JSONObject;

export type JSONObject = {
	[key: string]: JSONValue | undefined;
};