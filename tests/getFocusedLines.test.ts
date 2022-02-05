import { LineFocusPlugin } from "../src";

describe('getFocusedLine function', () => {
    it('should parse single lines correctly', () => {
        let plugin = new LineFocusPlugin();
        // single line
        expect(plugin.getFocusedLines("focus=5")).toEqual([5]);
        // multiple individual lines
        expect(plugin.getFocusedLines("focus=5,6,8,10")).toEqual([5, 6, 8, 10]);
    });

    it('should parse line ranges correctly', () => {
        let plugin = new LineFocusPlugin();
        expect(plugin.getFocusedLines("focus=3:3")).toEqual([3]);
        // normal range
        expect(plugin.getFocusedLines("focus=5:8")).toEqual([5,6,7,8]);
        // multiple ranges
        expect(plugin.getFocusedLines("focus=5:8,10:15")).toEqual([5,6,7,8,10,11,12,13,14,15]);
        // overlap range
        expect(plugin.getFocusedLines("focus=5:8,10:14,2:7")).toEqual([2,3,4,5,6,7,8,10,11,12,13,14]);
        // sequenced range
        expect(plugin.getFocusedLines("focus=5:8,8:11")).toEqual([5,6,7,8,9,10,11]);
    });

    it('should parse the mixed input correctly', () => {
        let plugin = new LineFocusPlugin();
        expect(plugin.getFocusedLines("focus=5:8,12")).toEqual([5,6,7,8,12]);
        expect(plugin.getFocusedLines("focus=1,5:8")).toEqual([1,5,6,7,8]);
        expect(plugin.getFocusedLines("focus=1,5:8,2:4")).toEqual([1,2,3,4,5,6,7,8]);
    });

    it('should return empty array for illegal input', () => {
        let plugin = new LineFocusPlugin();
        expect(plugin.getFocusedLines("focus=a")).toEqual([]);
        expect(plugin.getFocusedLines("focus=")).toEqual([]);
        expect(plugin.getFocusedLines("focus=,")).toEqual([]);
        expect(plugin.getFocusedLines("focus=-10,5,9")).toEqual([5,9]);
        expect(plugin.getFocusedLines("focus=0")).toEqual([]);
        expect(plugin.getFocusedLines("focus=0,2:5")).toEqual([2,3,4,5]);
    });
});