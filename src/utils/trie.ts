export interface LocationItem {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

class TrieNode {
  children: { [key: string]: TrieNode } = {};
  isEnd: boolean = false;
  location: LocationItem | null = null;
}

export class LocationTrie {
  private root: TrieNode = new TrieNode();

  insert(location: LocationItem): void {
    let node = this.root;
    const text = location.name.toLowerCase();

    for (const char of text) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
    node.location = location;
  }

  private collect(node: TrieNode, results: LocationItem[], limit: number): void {
    if (results.length >= limit) return;

    if (node.isEnd && node.location) {
      results.push(node.location);
    }

    for (const char in node.children) {
      this.collect(node.children[char], results, limit);
    }
  }

  search(prefix: string, limit = 5): LocationItem[] {
    if (!prefix.trim()) return [];

    let node = this.root;
    const text = prefix.toLowerCase().trim();

    for (const char of text) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const results: LocationItem[] = [];
    this.collect(node, results, limit);
    return results;
  }
}