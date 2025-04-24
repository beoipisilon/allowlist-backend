import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { WhitelistQuestionsService } from '../services/whitelist-questions.service';
import { CreateWhitelistQuestionDto } from '../dto/create-whitelist-question.dto';
import { UpdateWhitelistQuestionDto } from '../dto/update-whitelist-question.dto';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';

@Controller('whitelist-questions')
@UseGuards(DiscordAuthGuard)
export class WhitelistQuestionsController {
    constructor(private readonly whitelistQuestionsService: WhitelistQuestionsService) {}

    @Get()
    @RequirePermissions('view_allowlists_questions')
    async findAll() {
        return this.whitelistQuestionsService.findAll();
    }

    @Get(':id')
    @RequirePermissions('view_allowlists_questions')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.whitelistQuestionsService.findOne(id);
    }

    @Post()
    @RequirePermissions('manage_allowlists_questions')
    async create(@Body() createWhitelistQuestionDto: CreateWhitelistQuestionDto, @Req() req) {
        return this.whitelistQuestionsService.create(createWhitelistQuestionDto, req);
    }

    @Patch(':id')
    @RequirePermissions('manage_allowlists_questions')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWhitelistQuestionDto: UpdateWhitelistQuestionDto,
        @Req() req
    ) {
        return this.whitelistQuestionsService.update(id, updateWhitelistQuestionDto, req);
    }

    @Delete(':id')
    @RequirePermissions('manage_allowlists_questions')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        return this.whitelistQuestionsService.remove(id, req);
    }
} 