import * as fs from 'fs/promises';
import * as path from 'path';
import { Project, SourceFile } from 'ts-morph';

// Interface for the project report
interface ProjectReport {
  projectName: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  tsConfig: Record<string, any> | string;
  entryPoints: string[];
  modules: string[];
  typesAndInterfaces: string[];
}

// Main function to analyze the project
async function analyzeTypeScriptProject(projectPath: string): Promise<ProjectReport> {
  const report: ProjectReport = {
    projectName: '',
    dependencies: {},
    devDependencies: {},
    tsConfig: 'No tsconfig.json found',
    entryPoints: [],
    modules: [],
    typesAndInterfaces: [],
  };

  try {
    // Read package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    report.projectName = packageJson.name || 'Unnamed Project';
    report.dependencies = packageJson.dependencies || {};
    report.devDependencies = packageJson.devDependencies || {};

    // Check for tsconfig.json
    const tsConfigPath = path.join(projectPath, 'tsconfig.json');
    let project: Project;
    try {
      report.tsConfig = JSON.parse(await fs.readFile(tsConfigPath, 'utf-8'));
      project = new Project({
        tsConfigFilePath: tsConfigPath,
      });
    } catch {
      console.warn('Warning: tsconfig.json not found. Using default configuration.');
      project = new Project({
        compilerOptions: {
          target: 'es2018',
          module: 'commonjs',
          lib: ['es2018'],
          allowJs: true,
        },
      });
    }

    // Find TypeScript files
    const tsFiles = await findTypeScriptFiles(projectPath);
    if (tsFiles.length === 0) {
      console.warn('No TypeScript files found in the project.');
      return report;
    }

    // Add TypeScript files to the project
    for (const file of tsFiles) {
      project.addSourceFileAtPath(file);
    }

    // Find entry points (e.g., index.ts, main.ts)
    const potentialEntryPoints = ['index.ts', 'main.ts', 'src/index.ts', 'src/main.ts'];
    for (const entry of potentialEntryPoints) {
      const entryPath = path.join(projectPath, entry);
      if (await fs.access(entryPath).then(() => true).catch(() => false)) {
        report.entryPoints.push(entry);
      }
    }

    // Analyze source files
    const sourceFiles = project.getSourceFiles();
    for (const sourceFile of sourceFiles) {
      // Collect module paths
      report.modules.push(sourceFile.getFilePath());

      // Extract types and interfaces
      const typeAliases = sourceFile.getTypeAliases().map(t => t.getName());
      const interfaces = sourceFile.getInterfaces().map(i => i.getName());
      report.typesAndInterfaces.push(...typeAliases, ...interfaces);
    }

    return report;
  } catch (error) {
    console.error('Error analyzing project:', error);
    throw error;
  }
}

// Helper function to find TypeScript files recursively
async function findTypeScriptFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findTypeScriptFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Function to print the report
function printReport(report: ProjectReport) {
  console.log(`# Project Analysis Report: ${report.projectName}`);
  console.log('\n## Dependencies');
  console.log(JSON.stringify(report.dependencies, null, 2));
  console.log('\n## Dev Dependencies');
  console.log(JSON.stringify(report.devDependencies, null, 2));
  console.log('\n## TypeScript Configuration');
  console.log(JSON.stringify(report.tsConfig, null, 2));
  console.log('\n## Entry Points');
  console.log(report.entryPoints.length ? report.entryPoints.join('\n') : 'None found');
  console.log('\n## Modules');
  console.log(report.modules.length ? report.modules.join('\n') : 'None found');
  console.log('\n## Types and Interfaces');
  console.log(report.typesAndInterfaces.length ? report.typesAndInterfaces.join('\n') : 'None found');
}

// Run the analysis
async function main() {
  const projectPath = process.argv[2] || '.';
  const report = await analyzeTypeScriptProject(projectPath);
  printReport(report);
}

main().catch(console.error);