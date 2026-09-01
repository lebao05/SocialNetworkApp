# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["src/Web/Web.csproj", "src/Web/"]
COPY ["src/Presentation/Presentation.csproj", "src/Presentation/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]

# Restore dependencies
RUN dotnet restore "src/Web/Web.csproj"

# Copy all source files
COPY . .

# Build the application
WORKDIR "/src/src/Web"
RUN dotnet build "Web.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Copy published files
COPY --from=publish /app/publish .

# Set environment to Production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Web.dll"]
