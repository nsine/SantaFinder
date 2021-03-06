import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ng2-pagination';

import { Santa } from '../../../data-services/view-models/santa.view-model';
import { SantasService } from '../../../data-services/santas.service';
import { PagedResponse } from '../../../shared/models/paged-response';

@Component({
    selector: 'santa-preview-list',
    templateUrl: './santa-preview-list.html',
    styleUrls: ['./santa-preview-list.scss']
})
export class SantaPreviewListComponent implements OnInit {
    santas: Santa[] = [];

    paginationConfig: PaginationInstance = {
        currentPage: 1,
        itemsPerPage: 5
    };

    constructor(
        private santasService: SantasService
    ) { }

    ngOnInit() {
        this.loadCurrentPage();
    }

    onPageChanged(page: number) {
        this.paginationConfig.currentPage = page;
        this.loadCurrentPage();
    }

    loadCurrentPage() {
        this.santasService.getSantas(this.paginationConfig.itemsPerPage,
                this.paginationConfig.currentPage - 1)
            .subscribe((res: PagedResponse<Santa>) => {
                this.santas = res.items;
                this.paginationConfig.totalItems = res.totalCount;
            }, console.log);
    }
}