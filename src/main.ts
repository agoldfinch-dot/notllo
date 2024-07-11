import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const PORT = process.env.PORT || 8000
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle("Notllo").setDescription("IDK what I'm doing but I think it's okay").setVersion("1.0.0").addTag("agoldfinch-dot").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document)
  await app.listen(PORT, () => console.log(`Start on https://localhosts:${PORT}/`));
}
bootstrap();
