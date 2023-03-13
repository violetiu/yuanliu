import { ArrayLike } from "d3";

export function createYNode(tabName: string, props?: any): YNode {
    var node: YNode = { tagName: tabName,props:props};

    return node;
}

export interface YNode {
    tagName: string;
    props?:any;
    children?:ArrayLike<YNode>;
    appendChild?:(node:YNode)=>void;

}


