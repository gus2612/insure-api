import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PolicyRequestService } from './policy-request.service';
import { CreatePolicyRequestDto } from './dto/create-policy-request.dto';
import { UpdatePolicyRequestDto } from './dto/update-policy-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FiltersPolicyRequestDto } from './dto/filters-policy-request.dto';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';


@ApiTags('Policy Requests')
@Controller('policy-requests')
export class PolicyRequestController {
  constructor(private readonly policyRequestService: PolicyRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  create(@Body() createIssuanceRequestDto: CreatePolicyRequestDto) {
    return this.policyRequestService.create(createIssuanceRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('access-token')
  findAll(@Query() filters: FiltersPolicyRequestDto) {
    return this.policyRequestService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: number) {
    return this.policyRequestService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @Patch(':id/status')
  @ApiBearerAuth('access-token')
  update(
    @Param('id') id: number,
    @Body() UpdatePolicyRequestDto: UpdatePolicyRequestDto,
  ) {
    return this.policyRequestService.update(id, UpdatePolicyRequestDto);
  }
}
