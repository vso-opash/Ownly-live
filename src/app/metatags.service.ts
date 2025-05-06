import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Injectable()
export class MetatagsService {
  constructor(private title: Title, private meta: Meta) {}

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateTag(tag: MetaDefinition) {
    this.meta.updateTag(tag);
  }

  updateTags(tags: Array<MetaDefinition | null>) {
    tags.forEach((tag) => {
      tag && this.meta.updateTag(tag);
    });
  }
}